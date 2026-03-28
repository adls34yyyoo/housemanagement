# 🚀 快速部署指南

## 最简单的部署方式（5分钟搞定）

### 第一步：设置Supabase数据库（2分钟）

1. 打开 [https://supabase.com](https://supabase.com) 并注册/登录
2. 点击 "New Project" 创建项目
3. 项目创建后，进入 SQL Editor
4. 打开 `supabase-setup.sql` 文件，复制全部内容
5. 粘贴到 SQL Editor 中，点击 "Run"
6. 进入 Database -> Replication，点击 "Enable Realtime"，勾选 `properties` 和 `customers` 表

### 第二步：部署到Vercel（2分钟）

#### 方式A：使用Git（推荐）
1. 在 GitHub 创建新仓库
2. 把所有文件推送到仓库
3. 打开 [https://vercel.com](https://vercel.com)
4. 用GitHub登录，点击 "New Project"
5. 选择您的仓库，点击 "Deploy"
6. 等待完成！

#### 方式B：直接上传（更简单）
1. 打开 [https://vercel.com/new](https://vercel.com/new)
2. 点击 "Browse"，选择您的项目文件夹
3. 点击 "Deploy"
4. 完成！

### 第三步：配置CORS（1分钟）

1. 在Supabase中进入 Authentication -> URL Configuration
2. 在 Site URL 中填入您的Vercel域名（例如：`https://my-app.vercel.app`）
3. 点击 "Save"

### 第四步：测试！

1. 打开您的网站
2. 登录：用户名 `admin`，密码 `admin123`
3. 添加一个房源测试保存功能
4. 完成！🎉

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `mobile.html` | 主应用文件（必须） |
| `supabase-setup.sql` | 数据库设置脚本（必须在Supabase执行） |
| `vercel.json` | Vercel配置文件（可选） |
| `README-部署指南.md` | 详细部署指南 |
| `QUICKSTART.md` | 本文档，快速入门 |

---

## 常见问题

**Q: 保存房源失败怎么办？**
A: 检查浏览器Console（F12）的错误信息，通常是：
- 数据库表没创建 → 重新执行supabase-setup.sql
- CORS问题 → 在Supabase中配置正确的域名
- API密钥错误 → 检查mobile.html中的supabaseUrl和supabaseKey

**Q: 如何修改Supabase配置？**
A: 编辑mobile.html文件，找到：
```javascript
const supabaseUrl = 'https://xxx.supabase.co';
const supabaseKey = 'xxx';
```
替换为您自己的Supabase项目信息。

**Q: 可以用其他托管服务吗？**
A: 可以！任何静态网站托管都可以：Netlify、GitHub Pages、Cloudflare Pages等。

---

需要帮助？查看详细的 `README-部署指南.md` 文件！
