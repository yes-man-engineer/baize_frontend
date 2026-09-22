# baize_frontend

「起步方案」前端。Vite 7 + React 19 + TypeScript + Tailwind v4 + react-router。
产品背景和接口约定见 `CLAUDE.md`，以及后端仓库 `baize_backend/CLAUDE.md`。

## 运行

```bash
npm install
npm run dev      # http://localhost:3000，/api 代理到 http://localhost:8080
npm run build    # tsc --noEmit && vite build → dist/
```

## 配置

复制 `.env.example` 为 `.env`：

- `VITE_API_BASE`：后端前缀，默认 `/api`。nginx 同源反代时保持不变。
- `VITE_PROXY_TARGET`：仅开发期生效，vite 把 `/api` 代理到这里，默认 `http://localhost:8080`。

## 结构

```
src/
  api/        types.ts 与后端 JSON 对应；client.ts 统一 {code,message,data} 解包；projects.ts 八个接口
  pages/      HomePage 两个入口；ProjectPage 按 status / next_action 分发到下面三个界面
  features/
    chat/     对话页，输入框旁常驻「够了，先给我方案」
    paths/    入口 B 的 3 张候选路径卡片
    plan/     方案页：DocView 文档 + TaskBoard 任务板（同一份 items），ProgressBar 绿色占比，VerdictBanner 劝退
  components/ Button / Spinner / ErrorNote / BusyOverlay
  lib/        置信度、角度的文案和颜色
```

路由：`/` 入口页，`/p/:token` 项目页（token 就是凭证，存书签即可回来）。
