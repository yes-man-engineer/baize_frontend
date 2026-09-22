import { useEffect, useRef, useState, type ReactNode } from "react"
import type { PlanItem, ProjectDetail } from "@/api/types"
import { Button, ErrorNote, Page } from "@/components/ui"
import { formatMoney } from "@/lib/labels"
import DocView from "./DocView"
import ProgressBar from "./ProgressBar"
import TaskBoard from "./TaskBoard"
import VerdictBanner from "./VerdictBanner"

interface Props {
  detail: ProjectDetail
  onVerify: (itemId: string, answer: string) => Promise<PlanItem>
  onEnd: () => Promise<void>
  actionError: string | null
}

type Tab = "doc" | "tasks"

/**
 * 方案页：文档 + 任务板是同一份 items 的两个视图。
 * 任务板回填 → verify → 文档里对应那条变绿 → 顶部绿色占比上升。
 */
export default function PlanView({ detail, onVerify, onEnd, actionError }: Props) {
  const { project, items, tasks, progress, selected_path } = detail
  const ended = project.status === "ended"
  const stop = project.verdict === "stop"
  const done = items.filter((it) => Boolean(it.verified_at))

  const [tab, setTab] = useState<Tab>(tasks.length > 0 && !stop ? "tasks" : "doc")
  const [flashId, setFlashId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [ending, setEnding] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  async function handleVerify(itemId: string, answer: string) {
    const item = await onVerify(itemId, answer)
    // 联动反馈：文档里那条闪绿 + 顶部 toast。没有这个，用户做完一项感知不到任何变化。
    setFlashId(item.id)
    setToast(`「${item.title}」已变绿`)
    timers.current.push(window.setTimeout(() => setFlashId(null), 1700))
    timers.current.push(window.setTimeout(() => setToast(null), 2500))
    // 宽屏两栏并排时把文档对应条目滚进视野
    if (window.matchMedia("(min-width: 1024px)").matches) {
      requestAnimationFrame(() => {
        document.getElementById(`item-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      })
    }
    return item
  }

  async function handleEnd() {
    if (!window.confirm("确定结束这个项目？结束后不能再回填。")) return
    setEnding(true)
    try {
      await onEnd()
    } finally {
      setEnding(false)
    }
  }

  return (
    <Page className="pb-24">
      <header className="mb-5">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
          {ended ? "已结束" : stop ? "结论" : "起步方案"}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {project.idea || selected_path?.title || "起步方案"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
          {project.city && <span>📍 {project.city}</span>}
          {project.risk_budget >= 0 && <span>亏损上限 {formatMoney(project.risk_budget)}</span>}
          {project.weekly_hours >= 0 && <span>每周 {project.weekly_hours} 小时</span>}
          {selected_path && project.idea && <span>选的路：{selected_path.title}</span>}
        </div>
      </header>

      {ended && (
        <div className="mb-4 rounded-xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-700">
          项目已结束{project.ended_at ? `（${new Date(project.ended_at).toLocaleDateString("zh-CN")}）` : ""}
          。方案保留在这里，可以随时回来看。
        </div>
      )}

      <div className="space-y-4">
        <VerdictBanner project={project} />
        <div className="sticky top-2 z-10">
          <ProgressBar progress={progress} toast={toast} />
        </div>
        <ErrorNote message={actionError} />
      </div>

      {/* 窄屏：Tab 切换；宽屏：两栏并排 */}
      <div className="mt-5 flex rounded-lg border border-stone-200 bg-white p-1 text-sm lg:hidden">
        <TabButton active={tab === "doc"} onClick={() => setTab("doc")}>
          方案文档 <span className="text-stone-400">{items.length}</span>
        </TabButton>
        <TabButton active={tab === "tasks"} onClick={() => setTab("tasks")}>
          任务板{" "}
          {tasks.length > 0 ? (
            <span className="rounded-full bg-amber-100 px-1.5 text-xs text-amber-800">{tasks.length}</span>
          ) : (
            <span className="text-stone-400">0</span>
          )}
        </TabButton>
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-5 lg:items-start lg:gap-6">
        <section className={`${tab === "doc" ? "" : "hidden"} lg:col-span-3 lg:block`}>
          <h2 className="mb-3 hidden text-sm font-semibold text-stone-700 lg:block">方案文档</h2>
          <DocView items={items} flashId={flashId} />
        </section>
        <section className={`${tab === "tasks" ? "" : "hidden"} lg:col-span-2 lg:block lg:sticky lg:top-40`}>
          <h2 className="mb-3 hidden text-sm font-semibold text-stone-700 lg:block">
            任务板 <span className="font-normal text-stone-500">· 今晚两小时</span>
          </h2>
          <TaskBoard tasks={tasks} done={done} disabled={ended} onVerify={handleVerify} />
        </section>
      </div>

      {!ended && (
        <footer className="mt-12 flex items-center justify-between border-t border-stone-200 pt-6 text-xs text-stone-500">
          <span>不想做了就点右边。放弃是一个主动的动作，不是悄悄关掉页面。</span>
          <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={handleEnd} loading={ending}>
            结束项目
          </Button>
        </footer>
      )}
    </Page>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors ${
        active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
      }`}
    >
      {children}
    </button>
  )
}
