import type { Progress } from "@/api/types"

/** 常驻顶部：绿色占比是这个产品唯一的进度感。 */
export default function ProgressBar({ progress, toast }: { progress: Progress; toast: string | null }) {
  const { total, green, yellow, red, green_ratio, task_done, task_total } = progress
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0)

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums text-green-700">{green_ratio}%</span>
          <span className="text-sm text-stone-600">已确定</span>
        </div>
        <span className="text-xs text-stone-500 tabular-nums">
          作业 {task_done}/{task_total} 项已核实
        </span>
      </div>

      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div className="bg-green-500 transition-[width] duration-700 ease-out" style={{ width: `${pct(green)}%` }} />
        <div className="bg-amber-400 transition-[width] duration-700 ease-out" style={{ width: `${pct(yellow)}%` }} />
        <div className="bg-red-500 transition-[width] duration-700 ease-out" style={{ width: `${pct(red)}%` }} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
        <Legend dot="bg-green-500" text={`🟢 确定 ${green}`} />
        <Legend dot="bg-amber-400" text={`🟡 我猜的 ${yellow}`} />
        <Legend dot="bg-red-500" text={`🔴 只有你知道 ${red}`} />
        {toast && <span className="ml-auto font-medium text-green-700 transition-opacity">{toast}</span>}
      </div>
    </div>
  )
}

function Legend({ dot, text }: { dot: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${dot}`} />
      {text}
    </span>
  )
}
