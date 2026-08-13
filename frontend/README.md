# AnimeSearch - 动漫聚合搜索

> 在线动漫聚合搜索引擎，一站式搜索多个动漫资源站点

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19 |
| 语言 | TypeScript | 5.9 |
| 构建 | Vite | 7.3 |
| 状态管理 | Zustand | 5.0 |
| 样式 | Tailwind CSS | 4.1 |
| 动画 | Framer Motion | 12 |
| 图标 | Lucide React | 0.562 |
| UI 组件 | Radix UI | - |
| 音效 | Web Audio API | - |
| 评论 | Artalk | 2.9 |
| PWA | Serwist | 9 |

## 功能特性

- 🔍 **聚合搜索** - 同时搜索 70+ 动漫资源站点
- 📡 **SSE 流式** - 实时显示搜索进度和结果
- 🎬 **Bangumi 集成** - 显示动漫评分、简介等信息
- 🌓 **主题切换** - 支持浅色/深色/跟随系统
- 🔊 **音效反馈** - 交互音效提升体验
- ⌨️ **快捷键** - 键盘操作支持
- 💬 **评论系统** - Artalk 评论集成
- 📱 **PWA 支持** - 可安装为桌面应用

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── api/              # API 请求
│   ├── search.ts     # SSE 流式搜索
│   └── bangumi.ts    # Bangumi API
├── components/       # React 组件
│   ├── SearchHeader.tsx      # 搜索框 + 选项
│   ├── SearchResults.tsx     # 搜索结果列表
│   ├── BangumiCard.tsx       # Bangumi 信息卡片
│   ├── FloatingButtons.tsx   # 浮动按钮
│   ├── StatsCorner.tsx       # 统计角标
│   ├── SettingsModal.tsx     # 设置面板
│   ├── CommentsModal.tsx     # 评论面板
│   ├── UpdateToast.tsx       # SW 更新处理
│   ├── Background.tsx        # 背景装饰
│   └── ui/                   # 基础 UI 组件 (shadcn 风格)
├── lib/              # 工具库
│   ├── utils.ts      # 通用工具函数
│   └── sound.ts      # Web Audio API 音效
├── stores/           # Zustand 状态管理
│   ├── search.ts     # 搜索状态
│   └── ui.ts         # UI 状态
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
├── serwist.tsx       # Service Worker 注册 (SerwistProvider)
├── sw.ts             # Service Worker 源码 (Serwist)
├── index.css         # 全局样式 (Tailwind)
└── vite-env.d.ts     # Vite 类型声明
```

## 环境变量

```bash
# API 端点 (.env / .env.development)
VITE_API_BASE_URL=https://anime-search.saop.cc
```

## 构建说明

`pnpm build` 依次执行：

1. `tsc -b` - 类型检查（app / sw / node 三个项目引用）
2. `vite build` - 打包到 `dist/`
3. `serwist build` - 依据 `serwist.config.js` 注入预缓存清单并生成 `dist/sw.js`
