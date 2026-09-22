# 项目上下文

## 这是什么

「起步方案」产品的前端。配套后端仓库：`baize_backend`（同一个 GitHub 账号下），
产品背景、核心机制和产品规则都写在那个仓库的 `CLAUDE.md` 里，**动手前先读它**。

一句话：帮普通人把模糊的「我想做点什么」变成今晚就能开始验证的起步方案。

## 当前状态

**空骨架**。Vite 7 + React 19 + TypeScript 5.9，就一个 hello。
端口 3000，`@` 指向 `src`。**Tailwind 和 shadcn/ui 都没装**（原项目有，重置时按"最小骨架"清掉了），
要用的话自己装回来。

## 要做的三个界面

### 1. 对话页
一问一答。后端每次返回 `next_action` 决定下一步调哪个接口：
`ask` 继续答题 / `paths` 去选路 / `plan` 去出方案。

输入框旁边**常驻一个「够了，先给我方案」按钮**。这个按钮不是为了让 AI 知道
用户想停——模型从输入里就能判断——而是为了**可发现性**：很多人默认必须答完，
不会主动说停，只会直接关页面，而沉默流失是识别不到的。

### 2. 候选路径页（入口 B）
3 张卡片，`angle` 字段区分：`steady` 最稳 / `fast_cash` 最快回钱 /
`high_ceiling` 天花板最高。每张显示 `title` / `summary` / `why_you` /
`startup_cost` / `first_step`。选一条即合流回对话。

### 3. 方案页 —— 文档 + 任务板双视图
**这是产品的核心界面，也是最容易做错的地方。**

两个视图是**同一份数据**，不是两块独立内容：

- **文档视图**：渲染全部 `items`，每条按 `confidence` 上色
  （🟢 green 确定 / 🟡 yellow AI 猜的 / 🔴 red 只有你知道）
- **任务板**：只渲染 `tasks`（后端已过滤出 yellow + red），每条显示
  `verify_action`（今晚两小时能做完的动作），可勾选、可填 `answer`

**联动是关键**：任务板回填 → 调 `verify` 接口 → 文档里对应那条变绿。
文档顶部常驻 `progress.green_ratio` 绿色占比。

如果两个视图不联动，用户完成一项任务后感知不到任何变化，就没有做第二项的理由。
**这个联动是"进度可见"的唯一来源。**

另外 `project.verdict` 为 `stop` 时是劝退结论，要显眼地展示 `verdict_reason`，
不要把它藏在方案下面——这是产品底线，不是一条普通提示。

## 接口

后端默认 `http://localhost:8080`，需要加 `VITE_API_BASE` 配置（现在还没有）。
统一响应体是 `{ code, message, data }`，`code: 0` 为成功。

| 方法 | 路径 |
| --- | --- |
| POST | `/api/projects`　　body `{ idea?: string }`，留空即入口 B |
| POST | `/api/projects/:token/answers`　body `{ content }` |
| POST | `/api/projects/:token/paths` |
| POST | `/api/projects/:token/paths/:id/select` |
| POST | `/api/projects/:token/plan` |
| GET | `/api/projects/:token`　一次拿全，刷新页面用这个 |
| POST | `/api/projects/:token/items/:id/verify`　body `{ answer }` |
| POST | `/api/projects/:token/end` |

`GET /api/projects/:token` 返回 `{ project, items, tasks, paths, selected_path, messages, progress, next_action }`。

**没有账号体系**，`token` 就是凭证，放在 URL 里（比如 `/p/:token`），
用户存书签就能回来。

## 部署

旧项目的域名和 nginx 配置还在，只是仓库里的部署文件被清掉了。
如果还是 nginx 同源反代（前端静态 + `/api` 转 8080），`VITE_API_BASE` 写 `/api` 即可，
后端 CORS 也就不用管了。
