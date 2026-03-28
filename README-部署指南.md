# 房源管理系统 - 完整部署指南

## 📋 目录
1. [Supabase云数据库设置](#1-supabase云数据库设置)
2. [前端部署到Vercel](#2-前端部署到vercel)
3. [前端部署到Netlify](#3-前端部署到netlify)
4. [CORS设置](#4-cors设置)
5. [验证部署](#5-验证部署)

---

## 1. Supabase云数据库设置

### 1.1 创建Supabase项目
1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Name: `property-management` (或您喜欢的名称)
   - Database Password: 设置一个安全的密码
   - Region: 选择离您最近的区域

### 1.2 执行数据库设置脚本
1. 项目创建完成后，进入Dashboard
2. 点击左侧菜单的 "SQL Editor"
3. 点击 "New Query"
4. 打开项目中的 `supabase-setup.sql` 文件
5. 复制全部内容并粘贴到SQL编辑器中
6. 点击 "Run" 执行脚本
7. 等待执行完成，应该看到 "数据库设置完成！" 的消息

### 1.3 启用Realtime功能
1. 点击左侧菜单的 "Database"
2. 选择 "Replication" 标签
3. 点击 "Enable Realtime" 按钮
4. 在 "Tables" 部分，勾选以下表：
   - `properties`
   - `customers`
5. 点击 "Save" 保存

### 1.4 获取API密钥
1. 点击左侧菜单的 "Settings"
2. 选择 "API" 标签
3. 复制以下信息（已配置在代码中，如需更改请更新mobile.html）：
   - Project URL: `https://txqgghyptqptbvwxqfbb.supabase.co`
   - anon/public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 2. 前端部署到Vercel

### 2.1 准备代码
确保您的项目包含以下文件：
- `mobile.html` - 主应用文件
- `vercel.json` - Vercel配置文件
- `supabase-setup.sql` - 数据库设置脚本

### 2.2 使用Git部署（推荐）
1. 在GitHub/GitLab上创建一个新仓库
2. 将项目文件推送到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/property-management.git
   git push -u origin main
   ```

3. 访问 [https://vercel.com](https://vercel.com)
4. 使用GitHub账号登录
5. 点击 "New Project"
6. 选择您刚创建的仓库
7. 点击 "Import"
8. 配置项目设置（保持默认即可）
9. 点击 "Deploy"
10. 等待部署完成！

### 2.3 直接上传部署
1. 访问 [https://vercel.com/new](https://vercel.com/new)
2. 选择 "Browse" 上传文件夹
3. 选择您的项目文件夹
4. 点击 "Deploy"
5. 等待部署完成！

---

## 3. 前端部署到Netlify

### 3.1 使用Git部署（推荐）
1. 将代码推送到GitHub/GitLab仓库（同上）
2. 访问 [https://app.netlify.com](https://app.netlify.com)
3. 使用GitHub账号登录
4. 点击 "New site from Git"
5. 选择 "GitHub"
6. 授权Netlify访问您的仓库
7. 选择您的仓库
8. 配置部署设置：
   - Base directory: 留空
   - Publish directory: 留空
9. 点击 "Deploy site"

### 3.2 直接拖拽部署
1. 访问 [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. 将您的项目文件夹拖拽到页面上
3. 等待上传和部署完成！

---

## 4. CORS设置

### 4.1 在Supabase中配置CORS
1. 进入Supabase Dashboard
2. 点击左侧菜单的 "Authentication"
3. 选择 "URL Configuration" 标签
4. 在 "Site URL" 中输入您的部署域名：
   - Vercel: `https://your-project.vercel.app`
   - Netlify: `https://your-project.netlify.app`
5. 在 "Redirect URLs" 中添加：
   - `https://your-project.vercel.app/*`
   - `https://your-project.netlify.app/*`
6. 点击 "Save"

### 4.2 额外的CORS配置（如需要）
1. 点击左侧菜单的 "Settings"
2. 选择 "API" 标签
3. 在 "CORS Origins" 中添加您的域名
4. 点击 "Save"

---

## 5. 验证部署

### 5.1 检查数据库连接
1. 打开您部署的网站
2. 使用默认账号登录：
   - 用户名: `admin`
   - 密码: `admin123`
3. 打开浏览器开发者工具 (F12)
4. 查看Console标签
5. 应该看到：
   - "页面加载完成，开始初始化..."
   - "✅ Supabase初始化成功"
   - "实时连接状态: SUBSCRIBED"
6. 检查右上角的连接状态指示器，应该显示"已连接"（绿色）

### 5.2 测试保存功能
1. 点击 "+ 添加房源"
2. 填写房源信息：
   - 小区: `金地城`
   - 装修: `精装修`
   - 价格: `5000`
   - 地区: `惠南镇`
   - 户型: `3-2-2`
3. 点击 "AI识别并填充" 测试识别功能
4. 点击 "保存"
5. 应该看到 "✅ 房源保存成功" 的提示
6. 返回房源列表，应该能看到刚添加的房源

### 5.3 测试实时同步
1. 在两个不同的浏览器窗口/设备中打开网站
2. 在一个窗口中添加/编辑/删除房源
3. 观察另一个窗口是否自动更新
4. 应该看到 "数据已同步" 的提示

---

## 🎉 完成！

恭喜！您的房源管理系统已经成功部署到网上云数据库！

### 有用的链接
- 您的网站: [https://your-project.vercel.app]()
- Supabase Dashboard: [https://supabase.com/dashboard]()
- Vercel Dashboard: [https://vercel.com/dashboard]()
- Netlify Dashboard: [https://app.netlify.com]()

### 下一步
- 自定义网站域名
- 添加用户认证
- 优化安全性
- 添加更多功能

如有问题，请查看浏览器Console中的错误信息！
