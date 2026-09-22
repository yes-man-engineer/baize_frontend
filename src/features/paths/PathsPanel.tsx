import { useState } from "react"
import type { PathOption } from "@/api/types"
import { Button, ErrorNote, Page } from "@/components/ui"
import { angleOf, formatMoney } from "@/lib/labels"

interface Props {
  paths: PathOption[]
  riskBudget: number
  onSelect: (pathId: string) => Promise<void>
  onGenerate: () => Promise<void>
  actionError: string | null
}

const ORDER = { steady: 0, fast_cash: 1, high_ceiling: 2 } as const

export default function PathsPanel({ paths, riskBudget, onSelect, onGenerate, actionError }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const sorted = [...paths].sort(
    (a, b) => (ORDER[a.angle] ?? 9) - (ORDER[b.angle] ?? 9) || a.sort_order - b.sort_order,
  )

  return (
    <Page>
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">第二步 · 选一条路</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">三条能走的路，选一条</h1>
        <p className="mt-2 text-sm text-stone-600">
          三条故意拉得很开：一条最稳、一条最快回钱、一条天花板最高。
          {riskBudget >= 0 && <>启动投入都控制在你说的 {formatMoney(riskBudget)} 以内。</>}
          选完立刻接着往下问，围绕这条路出方案。
        </p>
      </header>

      <ErrorNote message={actionError} />

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 p-8 text-center">
          <p className="text-sm text-stone-600">候选路径还没生成。</p>
          <Button className="mt-3" onClick={onGenerate}>
            生成三条路
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sorted.map((p) => {
            const a = angleOf(p.angle)
            const selecting = picked === p.id
            return (
              <article
                key={p.id}
                className={`flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ring-2 ring-transparent transition ${a.ring}`}
              >
                <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${a.badge}`}>{a.label}</span>
                <h2 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">{p.summary}</p>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-stone-500">为什么是你</dt>
                    <dd className="mt-0.5 leading-relaxed text-stone-800">{p.why_you}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-stone-500">启动投入</dt>
                    <dd className="mt-0.5 font-medium text-stone-900">{formatMoney(p.startup_cost)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-stone-500">第一步</dt>
                    <dd className="mt-0.5 leading-relaxed text-stone-800">{p.first_step}</dd>
                  </div>
                </dl>

                <Button
                  className="mt-5 w-full"
                  loading={selecting}
                  disabled={picked !== null}
                  onClick={async () => {
                    setPicked(p.id)
                    try {
                      await onSelect(p.id)
                    } finally {
                      setPicked(null)
                    }
                  }}
                >
                  就走这条
                </Button>
              </article>
            )
          })}
        </div>
      )}

      {sorted.length > 0 && sorted.length < 3 && (
        <p className="mt-4 text-center text-xs text-stone-500">
          这次只给出了 {sorted.length} 条，
          <button type="button" className="underline underline-offset-2" onClick={onGenerate}>
            再试一次
          </button>
          凑齐三条。
        </p>
      )}
    </Page>
  )
}
