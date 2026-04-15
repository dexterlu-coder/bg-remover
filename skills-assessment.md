# Skills 评估报告 - ImageBackgroundRemover 项目

**评估时间**: 2026-04-15 11:20  
**评估目的**: 确定是否需要安装额外 Skills 来支持项目开发

---

## 📋 当前已安装的 Skills

### OpenClaw 配置中已启用的 Skills
| Skill | 位置 | 状态 | 用途 |
|-------|------|------|------|
| `mcporter` | 系统内置 | ✅ | MCP 服务器桥接 |
| `websearch` | `~/.openclaw/skills/websearch/` | ✅ | 网络搜索 |
| `image-analyzer` | `~/.openclaw/skills/image-analyzer/` | ✅ | 图片分析 |

### 飞书插件 Skills (openclaw-lark)
| Skill | 状态 | 用途 |
|-------|------|------|
| `feishu-bitable` | ✅ | 多维表格管理 |
| `feishu-calendar` | ✅ | 日历日程管理 |
| `feishu-create-doc` | ✅ | 创建云文档 |
| `feishu-fetch-doc` | ✅ | 获取云文档内容 |
| `feishu-update-doc` | ✅ | 更新云文档 |
| `feishu-im-read` | ✅ | 飞书消息读取 |
| `feishu-task` | ✅ | 飞书任务管理 |

---

## 🔍 ClawHub GitHub 相关 Skills 调研

### 候选 Skill 1: openclaw-github-assistant
**来源**: https://clawhub.ai/conorkenn/openclaw-github-assistant

**功能**:
- 列出仓库 (`list_repos`)
- 获取仓库详情 (`get_repo`)
- 检查 CI 状态 (`check_ci_status`)
- 创建 Issue (`create_issue`)
- 创建仓库 (`create_repo`)
- 搜索仓库 (`search_repos`)
- 获取最近活动 (`get_recent_activity`)

**安全评估**: ✅ 通过
- 代码透明，无恶意代码
- 需要 `GITHUB_TOKEN` 和 `GITHUB_USERNAME`
- 建议最小权限 scope（避免完整 `repo` 权限）
- 无自动持久化权限

**安装方式**:
```bash
npx clawhub@latest install openclaw-github-assistant
```

### 候选 Skill 2: github-cli
**来源**: https://clawhub.ai/tag-assistant/github-cli

**功能**:
- GitHub CLI (`gh`) 命令参考文档
- 提供安装指南（brew/apt）
- 包含认证、仓库管理、PR/Issue 操作等命令示例

**安全评估**: ⚠️ 注意
- 本质是文档/参考，不是功能性 Skill
- 示例中包含 token 暴露命令，需谨慎执行
- 需要安装 `gh` 二进制文件

---

## 📊 项目需求 vs Skills 能力对比

### bg-remover 项目需要的操作

| 任务 | 所需能力 | 当前可用方案 | 是否需要 Skill |
|------|----------|--------------|----------------|
| 配置 Git 远程仓库 | `git remote add` | ✅ 系统 git CLI | ❌ 不需要 |
| 推送代码到 GitHub | `git push` | ✅ 系统 git CLI | ❌ 不需要 |
| 创建 GitHub 仓库 | GitHub API | ⚠️ 需手动创建 或 Skill | 🟡 可选 |
| 管理 CI/CD | GitHub Actions | ⚠️ 需手动配置 | 🟡 可选 |
| 创建 Issue/PR | GitHub API | ⚠️ 需手动操作 | 🟡 可选 |

### 当前系统能力检查

```bash
# 已安装的工具
✅ Node.js v22.22.1
✅ npm 10.9.4
✅ git 2.43.0
⬜ wrangler (需要安装：npm install -g wrangler)
⬜ gh (GitHub CLI，可选)
```

---

## 💡 评估结论

### 🟢 推荐：不安装 GitHub Skill

**理由**:

1. **Git 基础操作已足够**
   - 项目只需要 `git remote add` 和 `git push`
   - 系统已安装 git 2.43.0，完全满足需求
   - 手动执行更简单直接

2. **减少依赖和配置复杂度**
   - GitHub Skill 需要配置 `GITHUB_TOKEN`
   - 需要额外的安全考虑（token 权限管理）
   - 当前任务不需要自动化 GitHub 操作

3. **现有工具链完整**
   ```bash
   # 创建仓库后，只需 3 步：
   git remote add origin <repo-url>
   git branch -M main
   git push -u origin main
   ```

### 🟡 可选：安装 openclaw-github-assistant

**如果你希望**:
- 自动化创建 GitHub 仓库
- 在聊天中直接管理 Issues/PRs
- 检查 CI/CD 状态

**可以安装**:
```bash
npx clawhub@latest install openclaw-github-assistant
```

**前提条件**:
1. 生成 GitHub Personal Access Token
2. 配置到环境变量或 OpenClaw config
3. 重启 OpenClaw gateway

---

## 🎯 最终建议

### 当前阶段（MVP 开发）：**不需要安装**

**原因**:
1. 项目只需基础 git push，现有 git CLI 已足够
2. 减少配置步骤，快速上线
3. GitHub 仓库手动创建更简单（1 分钟）

### 后续阶段（如需自动化）：**可以考虑**

**适用场景**:
- 需要频繁创建/管理多个 GitHub 仓库
- 需要自动化 Issue/PR 流程
- 需要集成 CI/CD 状态检查

---

## 📋 其他可能有用的 Skills

### 与本项目相关的 ClawHub Skills

| Skill | 用途 | 推荐度 |
|-------|------|--------|
| `github-pages-auto-deploy` | 自动部署到 GitHub Pages | ⭐⭐ 不需要（我们用 Cloudflare） |
| `github-workflow` | 管理 GitHub Actions | ⭐⭐ 暂时不需要 |
| `github-code-analyzer` | 代码分析 | ⭐ 不需要 |

### 与部署相关的 Skills

| Skill | 用途 | 推荐度 |
|-------|------|--------|
| `cloudflare-workers` | Cloudflare 部署 | ⭐⭐⭐ 可能需要（如找到） |
| `nextjs-deploy` | Next.js 部署 | ⭐⭐ 不需要（wrangler 已足够） |

---

## ✅ 执行计划（不安装 Skill 方案）

### 步骤 1: 用户提供 GitHub 仓库 URL
```
用户在 GitHub 创建仓库后提供 URL
```

### 步骤 2: 配置远程仓库并推送
```bash
cd /home/dexterlu/.openclaw/workspace/project/bg-remover
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

### 步骤 3: 安装 wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 步骤 4: 配置 remove.bg API Key
```bash
wrangler secret put REMOVE_BG_API_KEY
```

### 步骤 5: 本地测试 + 部署
```bash
npm install
npm run dev        # 本地测试
npm run deploy     # 部署到 Cloudflare
```

**总耗时**: 约 25 分钟（用户提供信息后）

---

## 📝 总结

| 问题 | 结论 |
|------|------|
| 是否需要安装 GitHub Skill？ | ❌ 不需要 |
| 现有工具是否足够？ | ✅ 完全足够 |
| 需要用户提供什么？ | GitHub 仓库 URL + remove.bg API Key |
| 需要安装什么？ | wrangler CLI（npm 包，非 Skill） |
| 是否需要新 Skills？ | ❌ 不需要 |

---

*评估完成时间：2026-04-15 11:20*
