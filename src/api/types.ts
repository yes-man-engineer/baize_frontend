// 与后端 internal/model、internal/service 的 JSON 一一对应

export type NextAction = "opening" | "ask" | "paths" | "plan"
export type ProjectStatus = "scouting" | "choosing" | "interviewing" | "planned" | "ended"
export type Entry = "A" | "B"
export type Verdict = "" | "go" | "stop"
export type Confidence = "green" | "yellow" | "red"
export type PathAngle = "steady" | "fast_cash" | "high_ceiling"
export type Role = "user" | "assistant"

export interface Project {
  id: string
  token: string
  status: ProjectStatus
  entry: Entry
  idea: string
  city: string
  /** 打算投入的预算（元），-1 表示还没问到 */
  risk_budget: number
  /** 每周能投入几小时，-1 表示还没问到 */
  weekly_hours: number
  assets: string
  experience: string
  selected_path_id: string
  verdict: Verdict
  verdict_reason: string
  asked_count: number
  ended_at?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  project_id: string
  role: Role
  content: string
  created_at: string
}

export interface PathOption {
  id: string
  project_id: string
  title: string
  angle: PathAngle
  summary: string
  why_you: string
  startup_cost: number
  first_step: string
  sort_order: number
}

export interface PlanItem {
  id: string
  project_id: string
  section: string
  title: string
  content: string
  confidence: Confidence
  /** 黄色项的假设值，让用户去反驳 */
  assumption: string
  /** 今晚两小时内能做完的动作 */
  verify_action: string
  /** 用户回填的真实数据，填了就变绿 */
  answer: string
  verified_at?: string
  sort_order: number
}

export interface Progress {
  total: number
  green: number
  yellow: number
  red: number
  /** 0-100 */
  green_ratio: number
  task_total: number
  task_done: number
}

export interface ProjectDetail {
  project: Project
  items: PlanItem[]
  /** 后端已过滤出 yellow + red */
  tasks: PlanItem[]
  paths: PathOption[]
  selected_path?: PathOption
  messages: Message[]
  progress: Progress
  next_action: NextAction
}

/** 建项目只落库，不生成开场白，所以没有 question。next_action 恒为 opening。 */
export interface CreateResult {
  project: Project
  next_action: NextAction
}

export interface OpeningResult {
  project: Project
  question: string
  next_action: NextAction
}

export interface AnswerResult {
  project: Project
  /** done 为 true 时为空 */
  question: string
  next_action: NextAction
  done: boolean
}

export interface PathsResult {
  project: Project
  paths: PathOption[]
}

export interface VerifyResult {
  item: PlanItem
  progress: Progress
}
