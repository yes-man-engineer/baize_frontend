import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProject } from "@/api/projects"
import { errorMessage } from "@/api/client"
import { Button, ErrorNote, Page } from "@/components/ui"

export default function HomePage() {
  const navigate = useNavigate()
  const [idea, setIdea] = useState("")
  const [busy, setBusy] = useState<"A" | "B" | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function start(entry: "A" | "B") {
    if (entry === "A" && !idea.trim()) return
    setBusy(entry)
    setError(null)
    try {
      const res = await createProject(entry === "A" ? idea : "")
      navigate(`/p/${res.project.token}`)
    } catch (e) {
      setError(errorMessage(e))
      setBusy(null)
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

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <label htmlFor="idea" className="block text-sm font-medium text-stone-800">
          我有个想法
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              void start("A")
            }
          }}
          rows={3}
          maxLength={500}
          placeholder="比如：想去夜市卖烧烤 / 想在小区门口做早餐 / 想接点剪视频的活"
          className="mt-2 w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-base outline-none focus:border-stone-500"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-400">一句话就行，说不清也没关系，后面会问</span>
          <Button onClick={() => start("A")} loading={busy === "A"} disabled={!idea.trim() || busy !== null}>
            开始
          </Button>
        </div>
      </section>

      <div className="my-6 flex items-center gap-3 text-xs text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        或者
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <section className="rounded-2xl border border-dashed border-stone-300 p-5">
        <p className="text-sm font-medium text-stone-800">我还不知道能做什么</p>
        <p className="mt-1 text-sm text-stone-600">
          先盘点你手上现成有什么——做过什么、别人常找你帮什么忙、家里有什么——再给你三条能走的路。
        </p>
        <Button variant="secondary" className="mt-3" onClick={() => start("B")} loading={busy === "B"} disabled={busy !== null}>
          先盘点一下
        </Button>
      </section>

      <div className="mt-4">
        <ErrorNote message={error} />
      </div>
    </Page>
  )
}
