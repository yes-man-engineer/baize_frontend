import type { Project } from "@/api/types"

/**
 * verdict=stop 是劝退结论，是产品底线，必须放在方案上面显眼展示，
 * 不能藏成一条普通提示。
 */
export default function VerdictBanner({ project }: { project: Project }) {
  if (project.verdict !== "stop") return null
  return (
    <section role="alert" className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-wide text-red-700 uppercase">结论</p>
      <h2 className="mt-1 text-2xl font-semibold text-red-900">先别做</h2>
      <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap text-red-900">{project.verdict_reason}</p>
      <p className="mt-4 text-sm text-red-800/80">
        能说「不要做」是这个工具和满大街创业内容唯一的区别。下面只保留了止损相关的建议，没有执行方案。
      </p>
    </section>
  )
}
