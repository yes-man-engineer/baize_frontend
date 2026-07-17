# Claude Code 上下文文档 — Baize 项目

> 生成时间：2026-07-16
> 用途：交给 Claude Code 继续开发和调试

---

## 1. 项目概述

**Baize** 是一个创业社区平台，包含四个核心模块：
- **点子墙 (Idea Wall)**：分享创业点子
- **失败档案 (Failure Archive)**：记录和分析失败案例
- **在途项目 (Ongoing Projects)**：记录还在挣扎的项目
- **交流圈 (Community)**：社区讨论帖子
- **数据洞察 (Data Insights)**：失败数据分析图表

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.23 + Gin + GORM + MySQL 8.0 |
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + GSAP + Recharts |
| 部署 | 阿里云 ECS + Nginx + systemd + Docker (MySQL) |
| 域名 | `https://create-biz.baizelabs.cn` |
| 服务器 IP | `8.153.165.23` |

---

## 3. GitHub 仓库

- **后端**：`github.com/yes-man-engineer/baize_backend`
- **前端**：`github.com/yes-man-engineer/baize_frontend`

---

## 4. 本地工作区路径

- 后端：`/Users/admin/go/src/github.com/yes-man-engineer/baize_backend`
- 前端：`/Users/admin/gyy/baize_frontend`

---

## 5. 服务器部署架构

```
用户 → Nginx (80/443) → 前端静态文件 (dist/)
                        → /api/v1/* → proxy_pass → Go 后端 (127.0.0.1:8080)
                        → /uploads/* → proxy_pass → Go 后端
MySQL 8.0 (Docker, 3306端口) ← Go 后端
```

### 服务器文件路径

| 组件 | 路径 |
|------|------|
| 后端二进制 | `/opt/baize_backend/baize` |
| 后端源码 | `/opt/baize_backend/` |
| 后端环境变量 | `/opt/baize_backend/.env` |
| 前端静态文件 | `/opt/baize_frontend_dist/dist/` |
| Nginx 配置 | `/etc/nginx/conf.d/baize.conf` |
| systemd 服务 | `/etc/systemd/system/baize.service` |
| 上传文件目录 | `/opt/baize_backend/uploads/` |
| MySQL Docker | `baize_mysql` 容器 |

### 后端 .env 配置（服务器）

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=baize
DB_PASS=baize123
DB_NAME=baize
JWT_SECRET=baize-jwt-secret-key-change-me-in-production
SERVER_PORT=8080
GIN_MODE=release
```

---

## 6. API 端点列表（后端已实现）

所有 API 返回统一格式：`{"code":0,"message":"success","data":...}`，错误时 `code != 0`。

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/ideas` | GET | 列表（分页） |
| `/api/v1/ideas` | POST | 创建点子 |
| `/api/v1/ideas/:id` | GET | 详情 |
| `/api/v1/ideas/:id` | PUT | 更新 |
| `/api/v1/ideas/:id` | DELETE | 删除 |
| `/api/v1/ideas/:id/like` | POST | 点赞 |
| `/api/v1/failures` | GET | 列表（分页） |
| `/api/v1/failures` | POST | 创建失败案例 |
| `/api/v1/failures/:id` | GET | 详情 |
| `/api/v1/failures/:id` | PUT | 更新 |
| `/api/v1/failures/:id` | DELETE | 删除 |
| `/api/v1/failures/:id/like` | POST | 点赞 |
| `/api/v1/ongoing` | GET | 列表（分页） |
| `/api/v1/ongoing` | POST | 创建在途项目 |
| `/api/v1/ongoing/:id` | GET | 详情 |
| `/api/v1/ongoing/:id` | PUT | 更新 |
| `/api/v1/ongoing/:id` | DELETE | 删除 |
| `/api/v1/ongoing/:id/vote` | POST | 投票 |
| `/api/v1/posts` | GET | 列表（分页） |
| `/api/v1/posts` | POST | 创建帖子 |
| `/api/v1/posts/:id` | GET | 详情 |
| `/api/v1/posts/:id` | PUT | 更新 |
| `/api/v1/posts/:id` | DELETE | 删除 |
| `/api/v1/posts/:id/vote` | POST | 投票（body: `{type:"up"|"down"}`） |
| `/api/v1/insights/overview` | GET | 概览统计 |
| `/api/v1/insights/failure-reasons` | GET | 失败原因分析 |
| `/api/v1/insights/industry-mortality` | GET | 行业死亡率 |
| `/api/v1/insights/funding-distribution` | GET | 资金分布 |
| `/api/v1/auth/register` | POST | 注册 |
| `/api/v1/auth/login` | POST | 登录 |
| `/api/v1/auth/me` | GET | 当前用户（需 JWT） |
| `/api/v1/comments` | GET | 评论列表 |
| `/api/v1/comments` | POST | 创建评论 |
| `/api/v1/uploads` | POST | 文件上传 |
| `/uploads/:filename` | GET | 访问上传文件 |

### 后端数据模型（GORM）

```go
type Idea struct {
    Title, Category, Description, Author, Status, Image string
    StartupCost, Likes, Comments int
}

type Failure struct {
    Title, CompanyName, Category, Story, Lesson, MoneyBurned, Status, Image string
    StartupCost, TeamSize, Lifespan, Likes, Comments int
}

type Ongoing struct {
    Title, Category, Description, Struggle, Status, Burn string
    Months, TeamSize, Votes, Comments int
}

type CommunityPost struct {
    Title, Content, Author, Category, Images, Avatar string
    VotesUp, VotesDown, Comments int
}

type User struct {
    Username, Email, Password, Avatar string
}

type Comment struct {
    TargetType, Content, Author string
    TargetID, ParentID uint
}

type Vote struct {
    TargetType, UserID, Type string
    TargetID uint
}
```

---

## 7. 前端页面状态

### 前端路由（`src/App.tsx`）

```
/            → Home（首页）
/ideas       → IdeaWall（点子墙）
/failures    → FailureArchive（失败档案列表）
/failures/:slug → FailureDetail（失败详情页）
/ongoing     → OngoingProjects（在途项目）
/insights    → DataInsights（数据洞察）
/community   → Community（交流圈）
/submit      → Submit（提交页面）
/about       → About（关于）
```

### 前端 API 客户端（`src/api/client.ts`）

```typescript
const API_BASE = import.meta.env.VITE_API_BASE || ''; // 空字符串，即相对路径

// 统一响应格式：{code, message, data}
export const apiClient = {
  ideas: (params?) => api<PageData<IdeaItem>>(`/api/v1/ideas${params||''}`),
  failures: (params?) => api<PageData<FailureItem>>(`/api/v1/failures${params||''}`),
  ongoing: (params?) => api<PageData<OngoingItem>>(`/api/v1/ongoing${params||''}`),
  posts: (params?) => api<PageData<PostItem>>(`/api/v1/posts${params||''}`),
};
```

### 各页面 API 对接状态

| 页面 | 文件 | API 对接状态 | 说明 |
|------|------|-------------|------|
| **IdeaWall** | `src/pages/IdeaWall.tsx` | ✅ 已对接 | 调用 `apiClient.ideas()`，映射字段到本地 `Idea` interface |
| **FailureArchive** | `src/pages/FailureArchive.tsx` | ✅ 已对接 | 调用 `apiClient.failures()`，映射字段到本地 `FailureCase` interface |
| **OngoingProjects** | `src/pages/OngoingProjects.tsx` | ✅ 已对接 | 调用 `apiClient.ongoing()`，映射字段到本地 `OngoingProject` interface |
| **Community** | `src/pages/Community.tsx` | ✅ 已对接 | 同时调用 ideas + failures + ongoing + posts，合并为统一 `Post` interface 展示 |
| **Home** | `src/pages/Home.tsx` | ❌ **全静态 mock** | `stats`、`ideaCards`、`failureCases`、`failureCauses`、`industryMortality`、`communityQuotes` 全部硬编码，**未调用任何 API** |
| **FailureDetail** | `src/pages/FailureDetail.tsx` | ❌ **全静态 mock** | `TIMELINE`、`HARD_DATA`、`LESSONS`、`RELATED`、`GALLERY_IMAGES` 全部硬编码，路由参数 `slug` 被忽略，**未调用任何 API** |
| **DataInsights** | `src/pages/DataInsights.tsx` | ❌ **全静态数据** | `FAILURE_CAUSES_DATA`、`INDUSTRY_MORTALITY_DATA`、`BURN_RATE_DATA`、`SURVIVAL_RULES` 全部硬编码，**未调用 insights API** |
| **Submit** | `src/pages/Submit.tsx` | ❌ **仅前端状态** | 表单有完整字段和校验逻辑，但 `handleSubmit()` 只做了 `setSubmitted(true)`，**没有调用任何后端 API** |
| **About** | `src/pages/About.tsx` | ❌ 静态页面 | 无 API 需求 |

---

## 8. 已知问题和待办清单

### 8.1 关键问题（已修复）

- ✅ ~~数据库 `baize` 不存在~~ → 已创建数据库，后端 auto-migrate 成功，所有表已创建
- ✅ ~~API 返回 500 `Unknown database`~~ → 已修复，所有 API 返回 `code: 0` 成功

### 8.2 当前剩余问题（优先级排序）

#### P0 — 数据库为空
- **问题**：所有 API 返回 `list: []`，页面看起来是空的
- **修复**：需要添加种子数据（Seed Data），或者让 Submit 页面真正提交数据
- **建议**：写一个 `cmd/seed/main.go` 或 SQL 脚本，插入若干条 mock 数据

#### P1 — Submit 页面没有真正提交
- **问题**：`Submit.tsx` 的 `handleSubmit()` 只设置了 `submitted=true`，没有调用 API
- **修复**：根据 `mode`（idea/failure）调用 `POST /api/v1/ideas` 或 `POST /api/v1/failures`
- **注意**：后端 `CreateIdeaRequest` 和 `CreateFailureRequest` 的字段和前端表单字段需要对应

#### P1 — Home 页面全是静态数据
- **问题**：首页的统计数字、点子卡片、失败案例、数据图表全部硬编码
- **修复**：
  - 统计数字 → 调用 `GET /api/v1/insights/overview`
  - 点子卡片 → 调用 `GET /api/v1/ideas` 取前 N 条
  - 失败案例 → 调用 `GET /api/v1/failures` 取前 3 条
  - 数据图表 → 调用 `GET /api/v1/insights/failure-reasons` 和 `GET /api/v1/insights/industry-mortality`

#### P1 — FailureDetail 页面全是静态数据
- **问题**：忽略 URL 中的 `:slug`，所有内容都是硬编码的 `Meowspace` 数据
- **修复**：调用 `GET /api/v1/failures/:id` 获取真实数据，并渲染 timeline、lesson、related 等字段

#### P2 — DataInsights 页面静态数据
- **问题**：所有图表数据硬编码
- **修复**：调用 insights API 获取真实数据

#### P2 — 认证功能未实现
- **问题**：后端有 `/api/v1/auth/register` 和 `/api/v1/auth/login`，但前端没有登录/注册 UI
- **修复**：在 Navbar 添加登录/注册按钮，实现表单，存储 JWT token（localStorage）

#### P2 — 图片上传未对接
- **问题**：后端有 `/api/v1/uploads` 和 UploadHandler，但前端没有上传组件
- **修复**：Submit 页面添加图片上传功能，调用 `POST /api/v1/uploads`

#### P3 — 中文字符编码
- **问题**：之前出现过中文乱码
- **状态**：后端已加 `charset=utf-8` 响应头，数据库用 `utf8mb4`，应该已解决

---

## 9. 更新部署流程

### 后端更新

```bash
# 在本地
# 1. 修改代码 → git add → git commit → git push origin main

# 在服务器
ssh aliyun
cd /opt/baize_backend
git pull
go build -o baize cmd/api/main.go
systemctl restart baize
systemctl status baize --no-pager
```

### 前端更新

```bash
# 在本地
# 1. 修改代码
# 2. cd /Users/admin/gyy/baize_frontend
# 3. pnpm run build
# 4. tar -czf dist.tar.gz dist/

# 上传到服务器
scp dist.tar.gz aliyun:/opt/baize_frontend_dist/

# 在服务器
ssh aliyun
cd /opt/baize_frontend_dist
tar -xzf dist.tar.gz
# 不需要重启 nginx，刷新浏览器即可
```

---

## 10. SSH 配置

本地 `~/.ssh/config` 中有：
```
Host aliyun
    HostName 8.153.165.23
    User root
    IdentityFile ~/.ssh/id_ed25519_github
```

可以直接用 `ssh aliyun` 登录服务器。

---

## 11. 开发建议（给 Claude Code）

1. **先解决数据问题**：写种子数据或修复 Submit 页面，让用户能真正添加内容
2. **首页最关键**：Home 是用户第一印象，应该对接真实数据
3. **FailureDetail 需要 id 路由**：当前路由是 `/failures/:slug`，但后端 API 用数字 ID。建议前端改为用 `/failures/:id`，或者后端加一个 `slug` 字段
4. **前端 `VITE_API_BASE`**：当前为空字符串，使用相对路径。如果需要在本地开发时连接远程后端，可以在 `.env` 中设置 `VITE_API_BASE=https://create-biz.baizelabs.cn`

---

## 12. 文件快速参考

| 文件 | 路径 |
|------|------|
| 后端路由 | `internal/router/router.go` |
| 后端 handler | `internal/handler/*.go` |
| 后端 model | `internal/model/*.go` |
| 后端服务 | `internal/service/*.go` |
| 后端配置 | `internal/config/config.go` |
| 后端入口 | `cmd/api/main.go` |
| 前端路由 | `src/App.tsx` |
| 前端 API | `src/api/client.ts` |
| 前端页面 | `src/pages/*.tsx` |
| 前端组件 | `src/components/*.tsx` |
| 前端 shadcn | `src/components/ui/*.tsx` |

---

*本文档由 Kimi 生成，用于 Claude Code 接手继续开发。*
