import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ApiError, errorMessage } from "@/api/client"
import { getProject } from "@/api/projects"
import type { Detail, Message } from "@/api/types"
import { Button, ErrorNote, Page, Spinner } from "@/components/ui"

export default function ProjectPage() {
  const { id = "" } = useParams()
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    setLoadError(null)
    setNotFound(false)
    try {
      setDetail(await getProject(id))
    } catch (e) {
      if (e instanceof ApiError && e.notFound) setNotFound(true)
      else setLoadError(errorMessage(e))
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  if (notFound) {
    return (
      <Page className="flex min-h-screen max-w-2xl flex-col justify-center">
        <p className="text-base text-stone-600">这个项目不存在，可能链接不对或者已经被清掉了。</p>
        <Link to="/" className="mt-4 text-sm font-medium text-stone-900 underline">
          回去重新开一个
        </Link>
      </Page>
    )
  }

  if (loadError) {
    return (
      <Page className="flex min-h-screen max-w-2xl flex-col justify-center">
        <ErrorNote message={loadError} onRetry={() => void load()} />
      </Page>
    )
  }

  if (!detail) {
    return (
      <Page className="flex min-h-screen items-center justify-center">
        <Spinner />
      </Page>
    )
  }

  const { project, messages } = detail

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col">
      <header className="border-b border-stone-200 px-4 pt-5 pb-4 sm:px-6">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">提问</p>
        <h1 className="mt-1 truncate text-lg font-semibold">{project.title}</h1>
        <p className="mt-1 text-xs text-stone-500">不知道就直接说「不知道」，不会追问，会变成方案里的一项作业。</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}
      </div>

      {/* 对话接口还没写。与其画一个点了没反应的输入框，不如把话说明白。 */}
      <footer className="border-t border-stone-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            disabled
            placeholder="对话接口还在写，暂时发不出去"
            className="max-h-40 min-h-[42px] flex-1 resize-none rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-base outline-none"
          />
          <Button disabled>发送</Button>
        </div>
      </footer>
    </div>
  )
}

function Bubble({ message }: { message: Message }) {
  const mine = message.role === "user"
  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          mine
            ? "max-w-[80%] rounded-2xl bg-stone-900 px-4 py-2.5 text-base text-white"
            : "max-w-[80%] rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-base shadow-sm"
        }
      >
        {message.content}
      </div>
    </div>
  )
}
