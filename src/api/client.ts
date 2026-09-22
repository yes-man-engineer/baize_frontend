const BASE = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/+$/, "")

interface Envelope<T> {
  code: number
  message: string
  data?: T
}

export class ApiError extends Error {
  readonly code: number
  readonly status: number

  constructor(code: number, status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }

  get notFound(): boolean {
    return this.status === 404
  }
}

export async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(BASE + path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(-1, 0, "网络不通，检查一下网络或后端是否启动")
  }

  let json: Envelope<T> | null = null
  try {
    json = (await res.json()) as Envelope<T>
  } catch {
    json = null
  }

  if (!json || typeof json.code !== "number") {
    throw new ApiError(-1, res.status, res.ok ? "后端返回的格式不对" : `请求失败（${res.status}）`)
  }
  if (json.code !== 0) {
    throw new ApiError(json.code, res.status, json.message || "请求失败")
  }
  return json.data as T
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return "出了点问题，稍后再试"
}
