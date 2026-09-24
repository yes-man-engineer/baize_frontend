import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ApiError, errorMessage } from "@/api/client"
import { streamReply } from "@/api/chat"
import { getProject } from "@/api/projects"
import type { Message, Project } from "@/api/types"
import { Button, ErrorNote, Page, Spinner } from "@/components/ui"

export default function ProjectPage() {
  const { id = "" } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const bottom = useRef<HTMLDivElement>(null)
  // 开场白只能自动触发一次。开发模式下 effect 会跑两遍，没这个守卫会发两次请求。
  const opened = useRef(false)

  const load = useCallback(async () => {
    setLoadError(null)
    setNotFound(false)
    try {
      const detail = await getProject(id)
      setProject(detail.project)
      setMessages(detail.messages)
    } catch (e) {
      if (e instanceof ApiError && e.notFound) setNotFound(true)
      else setLoadError(errorMessage(e))
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, pending])

  const send = useCallback(
    async (content: string) => {
      if (streaming || !id) return

      setSendError(null)
      setStreaming(true)
      setPending("")

      // 先乐观显示出去，不然按完发送要等好几秒才看得到自己说的话
      const mine = content ? localMessage(id, "user", content) : null
      if (mine) setMessages((prev) => [...prev, mine])

      let full = ""
      try {
        const replyId = await streamReply(id, content, (delta) => {
          full += delta
          setPending(full)
        })
        setMessages((prev) => [...prev, localMessage(id, "assistant", full, replyId)])
      } catch (e) {
        setSendError(errorMessage(e))
        // 后端失败时一条都没存，用户那句也没存。这里把乐观加的那条撤掉，
        // 顺便把原文还回输入框，他改一改就能重发。
        if (mine) {
          setMessages((prev) => prev.filter((m) => m.id !== mine.id))
          setDraft((d) => d || content)
        }
      } finally {
        setStreaming(false)
        setPending("")
      }
    },
    [id, streaming],
  )

  // 刚建完项目时库里只有用户那一句，没人回他，这里自动让模型先开口。
  useEffect(() => {
    if (opened.current || !project || messages.length === 0) return
    if (messages[messages.length - 1].role !== "user") return
    opened.current = true
    void send("")
  }, [project, messages, send])

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

  if (!project) {
    return (
      <Page className="flex min-h-screen items-center justify-center">
        <Spinner />
      </Page>
    )
  }

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col">
      <header className="border-b border-stone-200 px-4 pt-5 pb-4 sm:px-6">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">提问</p>
        <h1 className="mt-1 truncate text-lg font-semibold">{project.title}</h1>
        <p className="mt-1 text-xs text-stone-500">不知道就直接说「不知道」，不会追问，会变成方案里的一项要你去核实的事。</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} content={m.content} />
        ))}

        {streaming && <Bubble role="assistant" content={pending} typing={!pending} />}

        <ErrorNote message={sendError} />
        <div ref={bottom} />
      </div>

      <footer className="border-t border-stone-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={draft}
            disabled={streaming}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                const content = draft.trim()
                if (!content) return
                setDraft("")
                void send(content)
              }
            }}
            placeholder={streaming ? "正在回复…" : "说点什么"}
            className="max-h-40 min-h-[42px] flex-1 resize-none rounded-lg border border-stone-300 px-3 py-2 text-base outline-none focus:border-stone-500 disabled:bg-stone-50"
          />
          <Button
            disabled={!draft.trim() || streaming}
            onClick={() => {
              const content = draft.trim()
              if (!content) return
              setDraft("")
              void send(content)
            }}
          >
            发送
          </Button>
        </div>
      </footer>
    </div>
  )
}

function Bubble({ role, content, typing }: { role: Message["role"]; content: string; typing?: boolean }) {
  const mine = role === "user"
  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          mine
            ? "max-w-[80%] rounded-2xl bg-stone-900 px-4 py-2.5 text-base whitespace-pre-wrap text-white"
            : "max-w-[80%] rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-base whitespace-pre-wrap shadow-sm"
        }
      >
        {typing ? <span className="text-stone-400">正在想…</span> : content}
      </div>
    </div>
  )
}

/**
 * localMessage 只为了立刻渲染，不是库里那一条。
 * id 给了就用库里的，没给就临时造一个，只用来当 React 的 key。
 */
function localMessage(projectId: string, role: Message["role"], content: string, id?: string): Message {
  const now = new Date().toISOString()
  return {
    id: id || `local-${role}-${now}-${Math.random().toString(36).slice(2, 8)}`,
    project_id: projectId,
    role,
    content,
    created_at: now,
    updated_at: now,
  }
}
