import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ApiError, errorMessage } from "@/api/client"
import {
  endProject,
  generatePaths,
  generatePlan,
  getProject,
  selectPath,
  submitAnswer,
  verifyItem,
} from "@/api/projects"
import type { Message, PlanItem, ProjectDetail } from "@/api/types"
import { BusyOverlay, Button, ErrorNote, Page, Spinner } from "@/components/ui"
import ChatPanel from "@/features/chat/ChatPanel"
import PathsPanel from "@/features/paths/PathsPanel"
import PlanView from "@/features/plan/PlanView"

type Busy = "paths" | "plan" | "select" | null

const BUSY_TEXT: Record<NonNullable<Busy>, string> = {
  paths: "正在根据你手上现成的东西，找三条能走的路……",
  plan: "正在生成方案：确定的给足，猜的标黄，只有你知道的标红……",
  select: "记下了，接着往下问……",
}

let tmpId = 0
const localMessage = (role: Message["role"], content: string): Message => ({
  id: `local-${++tmpId}`,
  project_id: "",
  role,
  content,
  created_at: new Date().toISOString(),
})

export default function ProjectPage() {
  const { token = "" } = useParams()
  const [detail, setDetail] = useState<ProjectDetail | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [busy, setBusy] = useState<Busy>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoadError(null)
    setNotFound(false)
    try {
      setDetail(await getProject(token))
    } catch (e) {
      if (e instanceof ApiError && e.notFound) setNotFound(true)
      else setLoadError(errorMessage(e))
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  // ---- 对话 ----
  async function handleAnswer(content: string) {
    if (!detail) return
    setActionError(null)
    setDetail((d) => d && { ...d, messages: [...d.messages, localMessage("user", content)] })
    try {
      const res = await submitAnswer(token, content)
      setDetail((d) => {
        if (!d) return d
        const messages = res.question ? [...d.messages, localMessage("assistant", res.question)] : d.messages
        return { ...d, project: res.project, messages, next_action: res.next_action }
      })
    } catch (e) {
      // 回滚乐观追加的那条用户消息
      setDetail((d) => d && { ...d, messages: d.messages.filter((m) => !m.id.startsWith("local-") || m.content !== content) })
      setActionError(errorMessage(e))
      throw e
    }
  }

  async function handleGeneratePaths() {
    setBusy("paths")
    setActionError(null)
    try {
      const res = await generatePaths(token)
      setDetail((d) => d && { ...d, project: res.project, paths: res.paths, next_action: "paths" })
    } catch (e) {
      setActionError(errorMessage(e))
    } finally {
      setBusy(null)
    }
  }

  async function handleGeneratePlan() {
    setBusy("plan")
    setActionError(null)
    try {
      setDetail(await generatePlan(token))
    } catch (e) {
      setActionError(errorMessage(e))
    } finally {
      setBusy(null)
    }
  }

  // ---- 选路 ----
  async function handleSelectPath(pathId: string) {
    setBusy("select")
    setActionError(null)
    try {
      const res = await selectPath(token, pathId)
      // 选路后后端会写入 user/assistant 消息，直接重拉一份最省心
      const fresh = await getProject(token)
      setDetail({ ...fresh, next_action: res.next_action })
    } catch (e) {
      setActionError(errorMessage(e))
    } finally {
      setBusy(null)
    }
  }

  // ---- 方案 ----
  async function handleVerify(itemId: string, answer: string): Promise<PlanItem> {
    const res = await verifyItem(token, itemId, answer)
    setDetail((d) => {
      if (!d) return d
      const items = d.items.map((it) => (it.id === res.item.id ? res.item : it))
      return {
        ...d,
        items,
        tasks: items.filter((it) => it.confidence === "yellow" || it.confidence === "red"),
        progress: res.progress,
      }
    })
    return res.item
  }

  async function handleEnd() {
    setActionError(null)
    try {
      const res = await endProject(token)
      setDetail((d) => d && { ...d, project: res.project })
    } catch (e) {
      setActionError(errorMessage(e))
    }
  }

  // ---- 渲染 ----
  if (notFound) {
    return (
      <Page className="flex min-h-screen max-w-xl flex-col items-center justify-center text-center">
        <p className="text-lg font-medium">项目不存在或链接失效</p>
        <p className="mt-2 text-sm text-stone-500">检查一下链接有没有复制全。</p>
        <Link to="/" className="mt-6 text-sm underline underline-offset-4">
          重新开始
        </Link>
      </Page>
    )
  }

  if (loadError) {
    return (
      <Page className="max-w-xl pt-20">
        <ErrorNote message={loadError} onRetry={load} />
      </Page>
    )
  }

  if (!detail) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-400">
        <Spinner />
      </div>
    )
  }

  const { project } = detail
  const inPlan = project.status === "planned" || project.status === "ended"
  const inChoosing = project.status === "choosing"

  return (
    <>
      <BusyOverlay text={busy ? BUSY_TEXT[busy] : null} />
      <TopBar token={token} />

      {inPlan ? (
        <PlanView detail={detail} onVerify={handleVerify} onEnd={handleEnd} actionError={actionError} />
      ) : inChoosing ? (
        <PathsPanel
          paths={detail.paths}
          riskBudget={project.risk_budget}
          onSelect={handleSelectPath}
          onGenerate={handleGeneratePaths}
          actionError={actionError}
        />
      ) : (
        <ChatPanel
          detail={detail}
          onAnswer={handleAnswer}
          onGeneratePaths={handleGeneratePaths}
          onGeneratePlan={handleGeneratePlan}
          actionError={actionError}
        />
      )}
    </>
  )
}

function TopBar({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.prompt("复制这个链接，随时回来：", window.location.href)
    }
  }

  return (
    <div className="border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          起步方案
        </Link>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="hidden sm:inline">没有账号，存好链接就能回来</span>
          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={copy} title={token}>
            {copied ? "已复制 ✓" : "复制链接"}
          </Button>
        </div>
      </div>
    </div>
  )
}
