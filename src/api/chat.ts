import { ApiError, BASE } from "./client"
import type { ChatEvent } from "./types"

/**
 * streamReply 让模型回一句，边收边通过 onDelta 往外吐。
 *
 * onProgress 有两种调用：thinkingChars 大于 0 表示模型还在思考，
 * 这是已思考的字数，text 为空；等于 0 时 text 才是给用户的正文。
 * 这个模型思考要花十几到几十秒，占掉首字延迟的全部，不给点反馈
 * 用户就得对着空白干等。思考内容本身后端不发，防提示词外泄。
 *
 * content 传空字符串表示「我没新话，你先开口」，刚建完项目的第一次就是这样。
 * 返回落库后那条回复的 id。
 *
 * 失败时后端一条都不会存（用户那句也不存），所以调用方失败后应该把
 * 乐观加上去的那条撤掉，让前后端保持一致。
 */
export async function streamReply(
  projectId: string,
  content: string,
  onProgress: (text: string, thinkingChars: number) => void,
): Promise<string> {
  const url = `${BASE}/projects/${encodeURIComponent(projectId)}/messages`

  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
  } catch {
    throw new ApiError(-1, 0, "网络不通，检查一下网络或后端是否启动")
  }

  // 参数错这类问题发生在开流之前，那时后端返回的是普通 JSON 信封不是 SSE
  if (!res.ok || !res.body) {
    let message = `请求失败（${res.status}）`
    try {
      const json = (await res.json()) as { message?: string }
      if (json?.message) message = json.message
    } catch {
      // 读不出来就用上面那句兜底
    }
    throw new ApiError(-1, res.status, message)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let messageId = ""
  // 错误是当成事件推下来的，这时 HTTP 状态码已经是 200 了，改不了。
  // 先记下来，等流读完再抛，免得漏掉后面的内容。
  let failure: string | null = null

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE 用空行分隔事件
    for (;;) {
      const cut = buffer.indexOf("\n\n")
      if (cut === -1) break
      const frame = buffer.slice(0, cut)
      buffer = buffer.slice(cut + 2)

      if (!frame.startsWith("data: ")) continue

      let event: ChatEvent
      try {
        event = JSON.parse(frame.slice(6)) as ChatEvent
      } catch {
        continue
      }

      if (event.type === "thinking") onProgress("", event.chars)
      else if (event.type === "delta") onProgress(event.text, 0)
      else if (event.type === "done") messageId = event.data.message_id
      else if (event.type === "error") failure = event.message
    }
  }

  if (failure) throw new ApiError(-1, 200, failure)
  return messageId
}
