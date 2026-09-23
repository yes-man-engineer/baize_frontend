import { useEffect, useRef, useState } from "react"
import type { Message, ProjectDetail } from "@/api/types"
import { Button, ErrorNote, Thinking } from "@/components/ui"

interface Props {
  detail: ProjectDetail
  /** 正在等开场白。开场白由对话页单独去要，等待也显示在这里。 */
  waitingOpening: boolean
  onAnswer: (content: string) => Promise<void>
  onGeneratePaths: () => Promise<void>
  onGeneratePlan: () => Promise<void>
  actionError: string | null
}

export default function ChatPanel({ detail, waitingOpening, onAnswer, onGeneratePaths, onGeneratePlan, actionError }: Props) {
  const { project, messages, next_action } = detail
  const scouting = project.status === "scouting"
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const thinking = sending || waitingOpening
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, thinking, next_action])

  useEffect(() => {
    if (!thinking) inputRef.current?.focus()
  }, [thinking])

  async function send() {
    const content = draft.trim()
    if (!content || thinking) return
    setSending(true)
    setDraft("")
    try {
      await onAnswer(content)
    } catch {
      setDraft(content) // 失败把内容还给输入框
    } finally {
      setSending(false)
    }
  }

  // 「够了」按钮：盘点阶段去选路，主干提问阶段直接出方案。
  const enough = scouting ? onGeneratePaths : onGeneratePlan
  const enoughLabel = scouting ? "够了，直接看能走哪几条路" : "够了，先给我方案"

  // 模型判断问得差不多了：不再显示输入框，换成一个明确的下一步
  const modelDone = next_action !== "ask" && next_action !== "opening"

  return (
    <div className="mx-auto flex h-[calc(100vh-41px)] w-full max-w-3xl flex-col">
      <header className="px-4 pt-5 sm:px-6">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
          {scouting ? "第一步 · 盘点手上现成有什么" : "提问 · 每个问题都对应方案里的一条"}
        </p>
        <h1 className="mt-1 truncate text-lg font-semibold">
          {project.idea || detail.selected_path?.title || "还不知道做什么，先盘点"}
        </h1>
        <p className="mt-1 text-xs text-stone-500">不知道就直接说「不知道」，不会追问，会变成方案里的一项作业。</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((m) => <Bubble key={m.id} message={m} />)}
        {thinking && <Thinking label={waitingOpening ? "在看你说的这件事……" : "在想下一个问题……"} />}
        {modelDone && !thinking && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-800">
              {next_action === "paths"
                ? "盘点得差不多了。接下来根据你手上现成的东西，给你三条能走的路。"
                : "问得差不多了，再问也不会改变方案里的任何一条。"}
            </p>
            <Button className="mt-3" onClick={next_action === "paths" ? onGeneratePaths : onGeneratePlan}>
              {next_action === "paths" ? "看看能走哪几条路" : "生成方案"}
            </Button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <footer className="border-t border-stone-200 bg-white px-4 py-3 sm:px-6">
        <ErrorNote message={actionError} />
        {!modelDone && (
          <div className="mt-2 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  void send()
                }
              }}
              rows={1}
              disabled={thinking}
              placeholder="直接说，不用想措辞。Enter 发送，Shift+Enter 换行"
              className="max-h-40 min-h-[42px] flex-1 resize-none rounded-lg border border-stone-300 px-3 py-2 text-base outline-none focus:border-stone-500 disabled:bg-stone-50"
            />
            <Button onClick={send} disabled={!draft.trim() || thinking}>
              发送
            </Button>
          </div>
        )}
        {/* 常驻：让「可以停」被看见。很多人默认必须答完，不会主动说停，只会直接关页面。 */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-400">已聊 {project.asked_count} 轮 · 不用答完，随时可以停</span>
          {!modelDone && (
            <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={enough} disabled={thinking}>
              {enoughLabel} →
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

function Bubble({ message }: { message: Message }) {
  const mine = message.role === "user"
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
          mine ? "rounded-br-md bg-stone-900 text-white" : "rounded-bl-md border border-stone-200 bg-white text-stone-900 shadow-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
