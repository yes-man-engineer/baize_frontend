import { request } from "./client"
import type {
  AnswerResult,
  CreateResult,
  OpeningResult,
  PathsResult,
  Project,
  ProjectDetail,
  VerifyResult,
} from "./types"

const p = (token: string) => `/projects/${encodeURIComponent(token)}`

/** 开新项目。idea 留空即入口 B（不知道做什么，先盘点）。 */
export function createProject(idea?: string) {
  return request<CreateResult>("POST", "/projects", { idea: idea?.trim() ?? "" })
}

/** 开场白单独要，因为要等模型十几秒。重复调只会拿到同一句，不会重复生成。 */
export function fetchOpening(token: string) {
  return request<OpeningResult>("POST", `${p(token)}/opening`)
}

/** 一次拿全，刷新页面用这个。 */
export function getProject(token: string) {
  return request<ProjectDetail>("GET", p(token))
}

export function submitAnswer(token: string, content: string) {
  return request<AnswerResult>("POST", `${p(token)}/answers`, { content })
}

/** 入口 B：盘点完生成 3 条候选路径。 */
export function generatePaths(token: string) {
  return request<PathsResult>("POST", `${p(token)}/paths`)
}

/** 选一条路径，立刻合流回主干提问。 */
export function selectPath(token: string, pathId: string) {
  return request<AnswerResult>("POST", `${p(token)}/paths/${encodeURIComponent(pathId)}/select`)
}

/** 生成方案。点「够了，先给我方案」也走这里。 */
export function generatePlan(token: string) {
  return request<ProjectDetail>("POST", `${p(token)}/plan`)
}

/** 回填真实数据，该条变绿。 */
export function verifyItem(token: string, itemId: string, answer: string) {
  return request<VerifyResult>("POST", `${p(token)}/items/${encodeURIComponent(itemId)}/verify`, { answer })
}

export function endProject(token: string) {
  return request<{ project: Project }>("POST", `${p(token)}/end`)
}
