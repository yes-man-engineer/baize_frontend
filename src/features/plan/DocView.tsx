import type { PlanItem } from "@/api/types"
import { confidenceOf } from "@/lib/labels"

interface Props {
  items: PlanItem[]
  flashId: string | null
}

/** 文档视图：渲染全部条目，按 confidence 上色。 */
export default function DocView({ items, flashId }: Props) {
  const sections = groupBySection(items)

  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-stone-500">方案里还没有条目。</p>
  }

  return (
    <div className="space-y-8">
      {sections.map(([section, list]) => (
        <section key={section}>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-stone-500 uppercase">{section}</h3>
          <div className="space-y-3">
            {list.map((it) => <DocItem key={it.id} item={it} flash={it.id === flashId} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

function DocItem({ item, flash }: { item: PlanItem; flash: boolean }) {
  const c = confidenceOf(item.confidence)
  const verified = Boolean(item.verified_at)

  return (
    <article
      id={`item-${item.id}`}
      className={`rounded-xl border border-stone-200 border-l-4 bg-white p-4 shadow-sm ${c.border} ${flash ? "flash-green" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.badge}`} title={c.hint}>
          {c.emoji} {verified ? "你核实的" : c.label}
        </span>
        <h4 className="text-[15px] font-semibold">{item.title}</h4>
      </div>

      {item.content && <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-stone-800">{item.content}</p>}

      {verified ? (
        <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-900">
          <span className="font-medium">你回填的真实数据：</span>
          <span className="whitespace-pre-wrap">{item.answer}</span>
        </div>
      ) : (
        <>
          {item.confidence === "yellow" && item.assumption && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <span className="font-medium">我先猜一个：</span>
              {item.assumption}
              <span className="text-amber-700/80">　——不对就去任务板反驳我</span>
            </p>
          )}
          {item.confidence !== "green" && item.verify_action && (
            <p className="mt-2 text-xs text-stone-500">
              <span className="font-medium">怎么核实：</span>
              {item.verify_action}
            </p>
          )}
        </>
      )}
    </article>
  )
}

function groupBySection(items: PlanItem[]): Array<[string, PlanItem[]]> {
  const map = new Map<string, PlanItem[]>()
  for (const it of [...items].sort((a, b) => a.sort_order - b.sort_order)) {
    const key = it.section || "其他"
    const list = map.get(key)
    if (list) list.push(it)
    else map.set(key, [it])
  }
  return [...map.entries()]
}
