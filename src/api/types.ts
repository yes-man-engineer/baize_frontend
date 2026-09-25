// 与后端 internal/model、internal/service 的 JSON 一一对应

/** 和后端 model.ProjectStatus 一一对应，改一边要改另一边 */
export type ProjectStatus =
  /** 还在聊 */
  | "chatting"
  /** 该问的都问到了，可以出方案；想接着聊也行 */
  | "ready"
  /** 方案已生成 */
  | "planned"
  /** 用户主动结束 */
  | "ended"
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

/**
 * 对话接口推下来的 SSE 事件，后端 handler/decorate.go 里的 sseEvent。
 * delta 一段正文 / done 说完了 / error 出错了（HTTP 状态码已经是 200，只能这样报）
 */
export type ChatEvent =
  /**
   * 模型还在思考，chars 是已经思考的字数。
   * 思考内容本身后端不会发下来：模型在思考里会大段复述系统提示词，
   * 发到浏览器等于把提示词公开。这里只有一个数字。
   */
  | { type: "thinking"; chars: number }
  | { type: "delta"; text: string }
  | { type: "done"; data: { message_id: string } }
  | { type: "error"; message: string }
