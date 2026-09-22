import type { Confidence, PathAngle, Progress } from "@/api/types"

export const CONFIDENCE: Record<
  Confidence,
  { emoji: string; label: string; hint: string; border: string; badge: string; dot: string }
> = {
  green: {
    emoji: "🟢",
    label: "确定",
    hint: "通用事实，不依赖具体地点",
    border: "border-l-green-500",
    badge: "bg-green-100 text-green-800",
    dot: "bg-green-500",
  },
  yellow: {
    emoji: "🟡",
    label: "我猜的",
    hint: "和本地强相关，给了一个具体假设，等你去反驳",
    border: "border-l-amber-400",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
  },
  red: {
    emoji: "🔴",
    label: "只有你知道",
    hint: "AI 无从得知，只给核实动作",
    border: "border-l-red-500",
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
}

export const ANGLE: Record<PathAngle, { label: string; desc: string; badge: string; ring: string }> = {
  steady: {
    label: "最稳",
    desc: "投入小、风险低，天花板也低",
    badge: "bg-sky-100 text-sky-800",
    ring: "hover:ring-sky-300",
  },
  fast_cash: {
    label: "最快回钱",
    desc: "优先解决现金流",
    badge: "bg-emerald-100 text-emerald-800",
    ring: "hover:ring-emerald-300",
  },
  high_ceiling: {
    label: "天花板最高",
    desc: "起步慢，但能做大",
    badge: "bg-violet-100 text-violet-800",
    ring: "hover:ring-violet-300",
  },
}

export function angleOf(angle: string) {
  return ANGLE[angle as PathAngle] ?? { label: angle, desc: "", badge: "bg-stone-100 text-stone-700", ring: "" }
}

export function confidenceOf(c: string) {
  return CONFIDENCE[c as Confidence] ?? CONFIDENCE.red
}

export function formatMoney(n: number): string {
  if (n < 0) return "未知"
  if (n >= 10000) {
    const w = n / 10000
    return `${Number.isInteger(w) ? w : w.toFixed(1)} 万元`
  }
  return `${n.toLocaleString("zh-CN")} 元`
}

export const EMPTY_PROGRESS: Progress = {
  total: 0,
  green: 0,
  yellow: 0,
  red: 0,
  green_ratio: 0,
  task_total: 0,
  task_done: 0,
}
