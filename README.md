# 🎨 AI 背景移除工具

轻量级在线图片背景移除工具，用户上传任意图片，自动移除背景并下载透明 PNG。

## ✨ 核心特性

- **快速**：5 秒内完成处理
- **简单**：无需注册，即传即用
- **高质量**：基于 remove.bg AI 模型
- **免费**：初期免费使用（限制额度）

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- Cloudflare 账号
- remove.bg API Key

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
wrangler login
wrangler secret put REMOVE_BG_API_KEY
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:8788

### 生产部署

```bash
npm run deploy
```

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 + React | 快速开发，SSR 支持 |
| 样式库 | Tailwind CSS | 快速构建 UI |
| 后端服务 | Cloudflare Workers | 全球部署，低成本 |
| AI 服务 | remove.bg API | 效果好，接入简单 |
| 部署平台 | Cloudflare Pages + Workers | 免费额度充足 |

## 📁 项目结构

```
bg-remover/
├── src/
│   ├── pages/
│   │   └── index.tsx          # 主页面
│   ├── functions/
│   │   └── api/
│   │       └── remove/
│   │           └── index.ts   # Workers API
│   ├── components/
│   │   ├── Upload.tsx         # 上传组件
│   │   ├── Preview.tsx        # 预览组件
│   │   └── Download.tsx       # 下载组件
│   └── lib/
│       └── remove-bg.ts       # API 封装
├── wrangler.toml              # Cloudflare 配置
├── package.json
├── tailwind.config.js
└── README.md
```

## 💰 成本估算

| 项目 | 免费额度 | 月成本（初期） |
|------|----------|----------------|
| Cloudflare Workers | 10 万请求/天 | $0 |
| Cloudflare Pages | 无限 | $0 |
| remove.bg API | 50 张/月 | $0-10 |
| **合计** | - | **$0-10** |

## 📅 开发计划

### 第一阶段：MVP（1-2 周）

- [ ] 项目初始化
- [ ] 前端页面开发
- [ ] Workers API 开发
- [ ] remove.bg 集成
- [ ] 测试与调试
- [ ] 部署上线

### 第二阶段：优化迭代（1 周）

- [ ] 性能优化
- [ ] UI/UX 优化
- [ ] 错误处理完善

### 第三阶段：功能扩展（2-4 周）

- [ ] 批量处理
- [ ] 图片编辑功能
- [ ] 背景替换

## 📄 许可证

MIT

## 🔗 相关链接

- [remove.bg API 文档](https://www.remove.bg/api)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Next.js 文档](https://nextjs.org/docs)

---

**状态**: 🚧 开发中  
**版本**: v0.1.0  
**最后更新**: 2026-04-10
