// 与后端 internal/model、internal/service 的 JSON 一一对应

export type ProjectStatus = "chatting" | "planned" | "ended"
export type Role = "user" | "assistant"

export interface Project {
  /** 没有账号体系，这串 uuid 就是访问凭证，存在链接里 */
  id: string
  user_id: string
  status: ProjectStatus
  /** 建项目时从第一句话截出来的，不用等模型 */
  title: string
  /** 模型从对话里抽出来的已确认信息。键不固定，值都是原话 */
  facts: Record<string, string>
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  project_id: string
  role: Role
  content: string
  created_at: string
  updated_at: string
}

/** 建项目和取详情返回的是同一个形状 */
export interface Detail {
  project: Project
  messages: Message[]
}
