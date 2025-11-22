# Simple Portfolio

[English](README.md) | [中文](README_zh.md)

一个现代化的响应式个人网站，使用 **Next.js 16** 和 **Tailwind CSS** 构建。

## ✨ 特性

- 🌍 **国际化**: 中英文双语支持，基于 React Context 管理
- 🌙 **深色模式**: 主题切换，支持系统偏好检测和本地存储持久化
- 📱 **响应式设计**: 基于 Tailwind CSS 的移动端优先设计
- 📡 **RSS 聚合**: 可配置的 RSS/Atom 源解析器，支持多种解析引擎
- 📧 **联系表单**: 使用 EmailJS 的功能完整的联系表单
- 📊 **数据分析**: Google Analytics 集成（可选）
- 🚀 **性能优化**: 静态网站生成，针对 Lighthouse 评分优化
- 🎨 **现代 UI**: 简洁专业的设计，流畅的动画和过渡效果

## 预览

![网站预览](public/assets/img/website.png)

## Lighthouse PageSpeed Insights

### 桌面端

[![Google Lighthouse PageSpeed Insights](public/assets/img/desktop_pagespeed.png)](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=desktop)

自行测试：[Google Lighthouse PageSpeed Insights](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=desktop)

### 移动端

[![Google Lighthouse PageSpeed Insights](public/assets/img/mobile_pagespeed.png)](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=mobile)

自行测试：[Google Lighthouse PageSpeed Insights](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=mobile)

## 项目结构

```text
src/
├── app/                 # Next.js App Router
│   ├── (main)/          # 主路由组，包含页头/页脚
│   │   ├── about/       # 关于页面
│   │   ├── contact/     # 联系页面
│   │   └── page.jsx     # 首页
│   ├── globals.css      # 全局样式
│   ├── layout.jsx       # 根布局（Providers、字体、分析）
│   └── not-found.jsx    # 404 页面，独立布局
├── components/
│   ├── layout/          # 布局组件
│   ├── pages/           # 页面特定组件（首页、关于、联系）
│   └── ui/              # 可复用 UI 组件
├── data/                # 动态数据（RSS 文章）
│   └── rss-posts.json   # 生成的 RSS 数据
├── lib/                 # Context 提供者和工具
│   ├── LanguageContext.jsx    # 语言状态管理
│   └── ThemeContext.jsx       # 主题状态管理
├── locales/             # 国际化文件
│   ├── config.js        # 语言环境配置
│   ├── en.json          # 英文内容
│   └── zh.json          # 中文内容
├── scripts/             # 构建脚本
│   └── fetch-rss.js     # RSS 聚合脚本
└── styles/              # 额外样式
```

## 开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装与配置

1. **克隆仓库并安装依赖**：

   ```bash
   git clone https://github.com/WayneXuCN/homepage.git
   cd homepage
   npm install
   ```

2. **配置环境变量**：

   基于 `.env.example` 创建 `.env` 文件：

   ```bash
   cp .env.example .env
   ```

   编辑 `.env` 文件配置：

   ```env
   # EmailJS（联系表单必需）
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here

   # Google Analytics（可选）
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **运行开发服务器**：

   ```bash
   npm run dev
   ```

   在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看。

## 构建与部署

### 静态导出

项目配置为静态网站生成：

```bash
npm run build
```

静态文件将生成在 `out/` 目录中，可部署到任何静态托管服务（GitHub Pages、Vercel、Netlify 等）。

### 构建流程

构建过程包含自动的 RSS 聚合步骤：

1. **预构建**: `npm run prebuild` 执行 `node scripts/fetch-rss.js`
2. **RSS 抓取**: 获取配置的 RSS/Atom 源并生成 `src/data/rss-posts.json`
3. **静态生成**: Next.js 使用 RSS 数据构建静态网站

## 配置

### 内容管理

所有网站内容通过 `src/locales/` 中的 JSON 文件管理，支持多语言，例如：

- `src/locales/example.zh.json` - 中文内容
- `src/locales/example.zh.json` - 英文内容

编辑这些文件可更新：

- 文本和标签
- 导航链接
- 项目项目
- 社交链接
- SEO 元数据

### RSS 配置

RSS 源在语言文件的 `featuredPosts.rss` 部分配置：

```json
{
  "featuredPosts": {
    "rss": {
      "enabled": true,
      "feeds": [
        {
          "url": "https://your-blog.com/feed.xml",
          "parser": "jekyllFeed"
        }
      ],
      "limit": 4
    }
  }
}
```

**可用解析器**：

- `default`: 标准 RSS/Atom 解析器
- `jekyllFeed`: 针对 Jekyll 生成源的增强解析器

### RSS 脚本选项

RSS 聚合脚本 (`scripts/fetch-rss.js`) 支持：

- 多源聚合
- 多解析器引擎与降级
- 自动去重
- 分类/标签提取

### EmailJS 设置

联系表单工作需要：

1. 创建 [EmailJS](https://www.emailjs.com/) 账户
2. 设置邮件服务
3. 创建邮件模板，包含变量：`user_name`, `user_email`, `topic`, `message`
4. 使用您的 EmailJS 凭证更新环境变量

### 主题自定义

- **颜色**: 在 `tailwind.config.js` 中修改 Tailwind 配置
- **字体**: 在相同配置中更新字体路径和权重
- **深色模式**: 通过 `dark:` 变体自动支持

## 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 生产构建（包含 RSS 抓取）

# RSS 管理
npm run fetch:rss        # 手动抓取 RSS 源
npm run prebuild         # RSS 抓取（构建前自动运行）

# 代码质量
npm run format           # 使用 Prettier 格式化代码
npm run format:check     # 检查代码格式
```

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 如需要则更新文档
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。
