import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { startProject } from "@/api/projects"
import { errorMessage } from "@/api/client"
import { Button, ErrorNote, Page } from "@/components/ui"

export default function HomePage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function start() {
    const content = draft.trim()
    if (!content || busy) return
    setBusy(true)
    setError(null)
    try {
      const detail = await startProject(content)
      navigate(`/p/${detail.project.id}`)
    } catch (e) {
      setError(errorMessage(e))
      setBusy(false)
    }
  }

  return (
    <Page className="flex min-h-screen max-w-2xl flex-col justify-center">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">起步方案</h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600">
          把模糊的「我想做点什么」，变成<span className="font-medium text-stone-900">今晚就能开始验证</span>的起步方案。
          <br />
          不装懂：确定的给足，猜的标出来，只有你知道的交给你去核实。
        </p>
      </header>

      {/* 只有一个入口。有没有想好要做什么，让模型从这句话里自己看，
          前端不做分支，也不逼用户先给自己归类。 */}
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <label htmlFor="draft" className="block text-sm font-medium text-stone-800">
          说说你的情况
        </label>
        <textarea
          id="draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              void start()
            }
          }}
          rows={3}
          maxLength={500}
          placeholder="比如：想去夜市卖烧烤 / 想在小区门口做早餐 / 手头有点闲钱和时间，还不知道能干点啥"
          className="mt-2 w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-base outline-none focus:border-stone-500"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-400">想好了没都行，说不清后面会问</span>
          <Button onClick={() => void start()} loading={busy} disabled={!draft.trim() || busy}>
            开始
          </Button>
        </div>
      </section>

      <ErrorNote message={error} />
    </Page>
  )
}
