import { request } from "./client"
import type { Detail } from "./types"

/** 用第一句话开一个项目。后端不调模型，几十毫秒就返回，拿到 id 直接跳转。 */
export function startProject(content: string) {
  return request<Detail>("POST", "/projects", { content })
}

/** 聊天页刷新用这个，一次拿全。 */
export function getProject(id: string) {
  return request<Detail>("GET", `/projects/${encodeURIComponent(id)}`)
}
