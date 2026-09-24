# 项目上下文

## 这是什么

「起步方案」产品的前端。配套后端仓库：`baize_backend`（同一个 GitHub 账号下），
产品背景和技术约束写在那个仓库的 `CLAUDE.md` 里，**动手前先读它**。

一句话：帮普通人把模糊的「我想做点什么」变成可以动手验证的起步方案。

**产品形态正在重新设计中。** 后端业务层 2026-09 推倒重写，目前接通了建项目、
取详情、流式对话三个接口，界面也只做到对应的程度。不要按旧版界面的样子补功能，
没接通的接口就是还没想清楚，不是漏做了。

**范围很宽，不要往窄里收。** 创业、副业、找工作、把现在的工作做得更好，
都在范围内，从高精尖到摆摊都算。文案和占位符里不要只举小生意的例子，
之前整套界面都围着夜市摆摊写，是错的。

## 技术栈

Vite 7 + React 19 + TypeScript 5.9 + Tailwind 4（走 `@tailwindcss/vite`，
不需要 config 文件）。端口 3000，`@` 指向 `src`。**没装组件库**，
`components/ui.tsx` 是手写的几个小件，要引入 shadcn 之类的先问。

```
src/api/client.ts     fetch 封装，统一响应体 { code, message, data }，code: 0 成功
src/api/types.ts      接口类型，和后端手工保持一致
src/api/projects.ts   startProject / getProject
src/api/chat.ts       streamReply，SSE 流式对话
src/pages/HomePage.tsx     单一入口，输入一句话就建项目并跳转
src/pages/ProjectPage.tsx  对话页，流式渲染
src/components/ui.tsx      零散的基础组件
```

## 已接通的接口

后端默认 `http://localhost:8080`，同源部署时 `VITE_API_BASE` 写 `/api`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/projects`　body `{ idea }` | 建项目，立即返回，不等模型 |
| GET | `/api/projects/:id` | 项目详情 + 全部消息 |

**没有账号体系**，project id 就是凭证，放在 URL 里（`/p/:id`），
用户存书签就能回来。不要把它叫 token，那个词在这个项目里只指模型的计量单位。

建项目**不等模型返回**，标题从用户输入里截一段先用着。让用户对着首页的按钮
干等二十秒，什么反馈都没有，是上一版最糟的体验。

## 对话是流式的

`POST /api/projects/:project_id/messages` 返回 SSE，事件三种：
`delta` 一段正文 / `done` 说完了带 message_id / `error` 出错了。

**出错也是走事件发下来的**，那时 HTTP 状态码已经是 200 了改不掉，所以
`res.ok` 为真不代表这次成功，要等流里的 `error` 事件。

`content` 传空字符串表示「我没新话，你先开口」。刚建完项目时库里只有用户
那一句没人回他，对话页会自动发一次空的。

**失败时后端一条都不存**，包括用户刚发的那句。所以前端失败后要把乐观渲染
的那条撤掉，并把原文还回输入框，否则刷新一下就对不上了。

## 还没做的

方案怎么展示，等后端定下方案的形态再说。

## 部署

nginx 同源反代（前端静态 + `/api` 转 8080），`VITE_API_BASE` 写 `/api`，
后端 CORS 就不用管。

`index.html` 必须配 `Cache-Control: no-cache`，`/assets/` 才能长缓存。
不配的话发版不生效，而且症状会伪装成后端的问题。详见后端仓库的部署章节。
