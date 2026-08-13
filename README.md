# AnimeSearch - 动漫聚合搜索

> 在线动漫聚合搜索引擎，一站式搜索 70+ 动漫资源站点

单仓库（monorepo）结构，包含前端与后端：

| 目录 | 说明 | 技术栈 |
|------|------|--------|
| [`frontend/`](frontend/) | Web 前端（SPA + PWA） | React 19 + Vite + TypeScript + Tailwind CSS 4 |
| [`api/`](api/) | 聚合搜索后端 | Rust + Axum + Tokio |

## 功能特性

- 🔍 **聚合搜索** - 同时搜索 70+ 动漫资源站点，兼容 [Kazumi](https://github.com/Predidit/Kazumi) 规则
- 📡 **SSE 流式** - 实时显示搜索进度和结果
- 🎬 **Bangumi 集成** - 显示动漫评分、简介等信息（后端内置 Bangumi API 代理）
- 🌓 **主题切换** / 🔊 **音效反馈** / 💬 **Artalk 评论** / 📱 **PWA 支持**

## 快速开始

### 后端（api/）

```bash
cd api
cargo run          # 开发运行，默认端口 3000
cargo build --release
```

### 前端（frontend/）

```bash
cd frontend
pnpm install
pnpm dev           # 开发服务器
pnpm build         # 生产构建（tsc + vite，含 PWA 生成）→ dist/
pnpm preview       # 预览生产构建
```

前端默认连接线上 API（`.env` 中的 `VITE_API_BASE_URL`）。本地联调时**不要改动已跟踪的
`.env`**，在 `frontend/.env.local`（已被 git 忽略）中写入
`VITE_API_BASE_URL=http://localhost:3000`，或直接在页面「设置」中自定义 API 地址。

## 部署

- **前端**：纯静态产物 `frontend/dist/`，可部署到 Cloudflare Pages 等任意静态托管
  （构建根目录 `frontend`，构建命令 `pnpm build`，输出目录 `dist`）。
- **后端**：单二进制，见 [api/README.md](api/README.md)（含 Nginx/SSE 反代配置与预编译产物说明）。

## License

MIT
