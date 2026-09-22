import { useState } from "react"
import type { PlanItem } from "@/api/types"
import { errorMessage } from "@/api/client"
import { Button } from "@/components/ui"
import { confidenceOf } from "@/lib/labels"

interface Props {
  tasks: PlanItem[]
  done: PlanItem[]
  disabled: boolean
  onVerify: (itemId: string, answer: string) => Promise<unknown>
}

/**
 * 任务板：只渲染 yellow + red。每条给 verify_action（今晚两小时能做完的动作），
 * 填上 answer 提交后，文档里对应那条就变绿。
 */
export default function TaskBoard({ tasks, done, disabled, onVerify }: Props) {
  const sorted = [...tasks].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-3">
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-green-300 bg-green-50 p-5 text-center text-sm text-green-900">
          {done.length > 0 ? "作业全做完了，方案里的每一条都是你核实过的。" : "这份方案没有需要你核实的条目。"}
        </div>
      ) : (
        <>
          <p className="text-xs text-stone-500">
            每一项都是今晚两小时能做完的事。黄色的先看假设对不对，红色的只有你能填。
          </p>
          {sorted.map((t) => <TaskCard key={t.id} task={t} disabled={disabled} onVerify={onVerify} />)}
        </>
      )}

      {done.length > 0 && (
        <details className="group mt-6" open={sorted.length === 0}>
          <summary className="cursor-pointer text-xs font-medium text-stone-500 select-none">
            已核实 {done.length} 项
          </summary>
          <div className="mt-2 space-y-2">
            {[...done]
              .sort((a, b) => (b.verified_at ?? "").localeCompare(a.verified_at ?? ""))
              .map((d) => (
                <div key={d.id} className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 p-3">
                  <input type="checkbox" checked readOnly className="mt-1 size-4 accent-green-600" aria-label="已核实" />
                  <div className="min-w-0 text-sm">
                    <p className="font-medium text-stone-700 line-through decoration-stone-400">{d.title}</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-green-900">{d.answer}</p>
                  </div>
                </div>
              ))}
          </div>
        </details>
      )}
    </div>
  )
}

function TaskCard({
  task,
  disabled,
  onVerify,
}: {
  task: PlanItem
  disabled: boolean
  onVerify: Props["onVerify"]
}) {
  const c = confidenceOf(task.confidence)
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    const a = answer.trim()
    if (!a || saving) return
    setSaving(true)
    setError(null)
    try {
      await onVerify(task.id, a)
      // 成功后这条会从 tasks 里消失，不用重置本地状态
    } catch (e) {
      setError(errorMessage(e))
      setSaving(false)
    }
  }

  return (
    <article className={`rounded-xl border border-stone-200 border-l-4 bg-white p-4 shadow-sm ${c.border}`}>
      <div className="flex items-start gap-3">
        {/* 勾选 = 展开回填框。后端要求必须带 answer，所以打勾本身不提交。 */}
        <input
          type="checkbox"
          checked={false}
          disabled={disabled}
          onChange={() => setOpen(true)}
          className="mt-1 size-4 shrink-0 cursor-pointer accent-green-600 disabled:cursor-not-allowed"
          aria-label={`核实：${task.title}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.badge}`}>
              {c.emoji} {c.label}
            </span>
            <h4 className="text-[15px] font-semibold">{task.title}</h4>
          </div>

          {task.confidence === "yellow" && task.assumption && (
            <p className="mt-2 text-sm text-amber-900">
              <span className="font-medium">我猜：</span>
              {task.assumption}
            </p>
          )}

          <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-800">
            <span className="font-medium text-stone-900">今晚去做：</span>
            {task.verify_action || "去实地或找人问一下，把真实数字填回来。"}
          </div>

          {!open ? (
            <Button variant="secondary" className="mt-3 px-3 py-1.5 text-xs" disabled={disabled} onClick={() => setOpen(true)}>
              {task.confidence === "yellow" ? "我知道真实情况，反驳一下" : "我问到了，填回来"}
            </Button>
          ) : (
            <div className="mt-3">
              <textarea
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    void submit()
                  }
                }}
                rows={2}
                disabled={disabled || saving}
                placeholder={
                  task.confidence === "yellow" ? "真实情况是……（比如：老王卖 6 块，不是 8 块）" : "问到的真实数字或情况……"
                }
                className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              />
              {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setOpen(false)} disabled={saving}>
                  先不填
                </Button>
                <Button className="px-3 py-1.5 text-xs" onClick={submit} loading={saving} disabled={!answer.trim() || disabled}>
                  回填，这条变绿
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
