<p align="center">
  <img src="public/assets/img/website.png" alt="LandingPage 预览" width="800" />
</p>

<h1 align="center">LandingPage</h1>

<p align="center">
  <strong>基于 Astro 5 构建的现代极简个人主页主题</strong>
</p>

<p align="center">
  <a href="https://github.com/WayneXuCN/LandingPage/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  </a>
  <a href="https://astro.build/">
    <img src="https://img.shields.io/badge/Astro-5.x-ff5d01.svg?logo=astro" alt="Astro" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19.x-61dafb.svg?logo=react" alt="React" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg?logo=tailwindcss" alt="Tailwind CSS" />
  </a>
  <a href="https://bun.sh/">
    <img src="https://img.shields.io/badge/Bun-1.x-fbf0df.svg?logo=bun" alt="Bun" />
  </a>
</p>

<p align="center">
  <a href="#特性">特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#配置">配置</a> •
  <a href="#部署">部署</a> •
  <a href="#贡献">贡献</a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README_zh.md">中文</a>
</p>

---

## 特性

| 特性 | 说明 |
|------|------|
| **国际化支持** | 基于 Astro 原生 i18n 路由和内容集合的多语言支持，包含 TypeScript 类型验证 |
| **深色模式** | 自动检测系统偏好，支持 localStorage 持久化 |
| **响应式设计** | 移动优先设计，适配各种设备 |
| **RSS 聚合** | 高级 RSS/Atom 源系统，支持多种解析器、自动图片生成和预构建抓取 |
| **联系表单** | 预配置 EmailJS 集成，开箱即用 |
| **数据分析** | 可选的 Google Analytics 4 集成 |
| **群岛架构** | React 组件按需加载，最小化 JS 体积 |
| **SEO 优化** | 自动生成支持 i18n 的 sitemap.xml 和 robots.txt |
| **极速性能** | 静态站点生成，优化资源和图片处理 |
| **图片优化** | 集成 Astro Image API，支持响应式图片生成 |
| **内容验证** | 所有内容使用 Zod 模式验证，提供 TypeScript 类型安全 |
| **自动化 RSS 抓取** | 预构建 RSS 抓取，包含重试逻辑和错误处理 |

## 快速开始

### 环境要求

- [Bun](https://bun.sh/) 1.0+（推荐）或 [Node.js](https://nodejs.org/) 18+

### 创建站点

```bash
# 克隆模板
git clone https://github.com/WayneXuCN/LandingPage.git my-site
cd my-site

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

在浏览器中打开 [http://localhost:4321](http://localhost:4321) 查看效果。

### 构建生产版本

```bash
# 构建站点（RSS 源会自动抓取）
bun run build

# 预览生产构建
bun run preview
```

输出文件生成在 `dist/` 目录，可部署到任意静态托管平台。

## 项目结构

```text
src/
├── components/
│   ├── react/          # React Islands（交互式组件）
│   │   ├── Contact.jsx        # EmailJS 联系表单
│   │   ├── ErrorBoundary.jsx  # React 错误边界
│   │   ├── HeaderBar.jsx      # 带语言切换的导航头部
│   │   ├── LanguageSwitcher.jsx # 语言选择器组件
│   │   ├── PrimaryNav.jsx     # 主导航菜单
│   │   ├── ThemeToggle.jsx    # 深色/浅色模式切换
│   │   └── UnderlineEffects.jsx # 下划线悬停效果
│   │
│   └── ui/             # Astro 组件（静态组件）
│       ├── Hero.astro              # 主页横幅区域
│       ├── Footer.astro            # 站点页脚
│       ├── WebsiteItem.astro       # 网站展示项
│       ├── WebsitesSection.astro   # 网站展示区域
│       ├── FeaturedPostItem.astro  # 特色文章项
│       └── FeaturedPostsSection.astro # 特色文章区域
│
├── layouts/
│   └── BaseLayout.astro  # 全局布局，包含 SEO 和元标签
│
├── lib/
│   ├── i18n.ts           # 国际化工具函数
│   ├── utils.ts          # 公共工具函数
│   ├── localImages.ts    # 本地图片处理工具
│   └── websiteImages.ts  # 网站图片处理工具
│
├── pages/
│   ├── index.astro       # 根首页（渲染中文版本）
│   ├── 404.astro         # 根 404 页面
│   └── [lang]/           # 动态语言路由
│       ├── index.astro   # 语言特定首页
│       ├── about.astro   # 关于页面
│       ├── contact.astro # 联系页面
│       └── 404.astro     # 语言特定 404 页面
│
├── data/
│   └── rss-posts.json    # RSS 聚合文章数据（自动生成）
│
└── styles/
    └── global.css        # 全局样式和自定义 CSS

i18n/                     # 国际化内容
├── zh_CN.json           # 中文内容
└── en_US.json           # 英文内容

scripts/
└── fetch-rss.bun.js     # RSS 抓取脚本，包含高级解析功能

src/
├── content.config.ts     # 内容集合模式和验证
└── middleware.ts         # 国际化路由中间件
```

## 配置

### 环境变量

在项目根目录创建 `.env` 文件：

```env
# EmailJS（联系表单必需）
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics（可选）
PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 站点配置

所有站点相关的配置都在 `astro.config.mjs` 文件中。以下是主要的配置项：

#### 环境说明

Astro 自动区分两种环境：

1. **开发环境**：运行 `bun run dev` 时
   - `import.meta.env.DEV` 为 `true`
   - 热重载、开发服务器等功能启用
   - 默认使用 `http://localhost:4321`

2. **生产环境**：运行 `bun run build` 构建时
   - `import.meta.env.DEV` 为 `false`
   - 代码优化、压缩等处理
   - 生成静态文件到 `dist/` 目录

#### 配置文件详解

```js
export default defineConfig({
  // 1. 站点域名配置
  // 如果您有域名，请在这里设置您的域名，例如：
  site: 'https://your-domain.com',
  
  // 如果您没有域名或只在本地测试，可以将此行注释掉或设置为空字符串：
  // site: '',
  
  // 2. 尾部斜杠策略
  // 'never' - URL 不以斜杠结尾
  // 'always' - URL 总是以斜杠结尾
  // 'ignore' - 保持原样（默认）
  trailingSlash: 'ignore',
  
  // 3. 构建输出模式
  // 'static' - 静态站点生成（推荐用于大多数部署）
  // 'hybrid' - 混合模式（部分页面预渲染）
  // 'server' - 服务器端渲染
  output: 'static',
  
  // 4. 国际化配置
  i18n: {
    defaultLocale: 'zh_CN',  // 默认语言
    locales: ['zh_CN', 'en_US'],  // 支持的语言列表
    routing: {
      prefixDefaultLocale: true,  // 是否为默认语言添加前缀
      redirectToDefaultLocale: false,  // 是否重定向到默认语言
    },
  },
  
  // 5. 集成配置（插件）
  integrations: [
    react(),      // React 支持
    mdx(),        // MDX 支持
    tailwind(),   // Tailwind CSS
    icon(),       // 图标支持
    sitemap({     // 自动生成支持 i18n 的 sitemap.xml
      i18n: {
        defaultLocale: 'zh_CN',
        locales: {
          zh_CN: 'zh-CN',
          en_US: 'en-US',
        },
      },
    }),
    robotsTxt(),  // 自动生成 robots.txt
  ],
  
  // 6. 图片优化配置
  image: {
    domains: ['images.unsplash.com', 'unsplash.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
});
```

**重要配置说明**：

1. **域名配置**：
   - **有域名的情况**：设置 `site` 为您的完整域名（如 `https://your-domain.com`）
   - **本地测试无域名**：将 `site` 设置为空字符串或注释掉此行，系统会自动使用 `http://localhost:4321`（开发环境）或相对路径（生产环境）
   - **生产环境部署**：确保设置正确的域名，否则 sitemap.xml 和 robots.txt 可能包含错误的 URL

2. **国际化配置**：
   - 修改 `defaultLocale` 更改默认语言
   - 在 `locales` 数组中添加或删除支持的语言
   - 调整 `routing` 选项控制 URL 结构

3. **SEO 优化**：
   - `sitemap` 集成会自动生成支持 i18n 的 sitemap.xml
   - `robotsTxt` 集成会自动生成 robots.txt
   - 这些都依赖于正确的 `site` 配置

4. **构建模式**：
   - 大多数情况下使用 `static` 模式即可
   - 如需动态功能可考虑 `hybrid` 或 `server` 模式

#### URL 处理逻辑

在 `src/layouts/BaseLayout.astro` 中，URL 的处理逻辑如下：

```javascript
const getSiteUrl = () => {
  // 1. 如果在 astro.config.mjs 中配置了 site，使用配置的域名
  if (Astro.site?.origin) {
    return Astro.site.origin;
  }
  
  // 2. 如果没有配置 site，根据环境使用不同的 URL
  // 开发环境：使用 localhost
  // 生产环境：使用空字符串（相对路径）
  return import.meta.env.DEV ? 'http://localhost:4321' : '';
};

// 3. 生成完整的 OG 图片 URL
const fullOgImage = ogImage.startsWith('http')
  ? ogImage
  : (siteUrl ? `${siteUrl}${ogImage}` : ogImage);
```

**不同场景下的 URL 处理**：

1. **有域名配置**（推荐）：
   - 开发环境：`https://your-domain.com/assets/img/og-image.png`
   - 生产环境：`https://your-domain.com/assets/img/og-image.png`

2. **无域名配置 - 开发环境**：
   - URL：`http://localhost:4321/assets/img/og-image.png`
   - 适合本地测试和开发

3. **无域名配置 - 生产环境**：
   - URL：`/assets/img/og-image.png`（相对路径）
   - 适合部署到子目录或不确定最终域名的情况

这种设计确保了无论是否有域名配置，网站都能正常工作。

### 内容管理

所有站点内容通过 `i18n/` 中的 JSON 文件管理：

| 文件 | 说明 |
|------|------|
| `zh_CN.json` | 中文内容 |
| `en_US.json` | 英文内容 |

文件结构遵循 `src/content.config.ts` 中定义的严格模式，使用 Zod 进行验证：

```json
{
  "site": { "title": "...", "description": "...", "author": "..." },
  "nav": [{ "label": "首页", "href": "index.html" }],
  "header": { "name": "...", "avatar": "..." },
  "hero": { "title": "...", "subtitle": "...", "description": "..." },
  "websites": { "title": "...", "items": [...] },
  "featuredPosts": { "title": "...", "rss": {...}, "items": [...] },
  "footer": { "copyright": "...", "socialLinks": [...] },
  "about": { ... },
  "contact": { ... }
}
```

### RSS 订阅

在语言 JSON 文件中配置 RSS 聚合：

```json
{
  "featuredPosts": {
    "rss": {
      "enabled": true,
      "feeds": [
        { "url": "https://blog.example.com/feed.xml", "parser": "default" },
        { "url": "https://astro-paper.vercel.app/rss.xml", "parser": "astroPaper" }
      ],
      "limit": 6
    }
  }
}
```

#### 支持的 RSS 解析器

| 解析器 | 说明 | 使用场景 |
|--------|------|----------|
| `default` | 标准 RSS/Atom 解析器 | 大多数 RSS 源 |
| `astroPaper` | Astro Paper 主题解析器 | 使用 Astro Paper 主题的博客 |
| `jekyllFeed` | Jekyll feed 解析器 | 基于 Jekyll 的博客 |

#### RSS 功能特性

- **多解析器支持**：不同格式的 feed 使用不同解析器
- **自动图片生成**：基于确定性哈希从 Picsum 生成图片
- **重试逻辑**：失败请求的指数退避重试
- **内容验证**：类型安全的内容处理
- **预构建抓取**：构建前自动运行

手动抓取 RSS 源：

```bash
bun run fetch:rss
```

## 自定义

### 添加新语言

项目默认支持 2 种语言（中文和英文）。要添加新语言，请按以下步骤操作：

1. **更新 Astro 配置**（`astro.config.mjs`）：

   ```js
   // 在 i18n 部分添加新的语言代码
   i18n: {
     defaultLocale: 'zh_CN',
     locales: ['zh_CN', 'en_US', 'NEW_LOCALE'], // 在此添加新的语言代码
     routing: {
       prefixDefaultLocale: true,
       redirectToDefaultLocale: false,
     },
   },
   
   // 同时更新站点地图的 i18n 配置
   sitemap({
     i18n: {
       defaultLocale: 'zh_CN',
       locales: {
         zh_CN: 'zh-CN',
         en_US: 'en-US',
         NEW_LOCALE: 'new-locale', // 添加新的语言映射
       },
     },
   }),
   ```

2. **更新 i18n 工具**（`src/lib/i18n.ts`）：

   ```ts
   // 添加到 locales 数组
   export const locales = ['zh_CN', 'en_US', 'NEW_LOCALE'] as const;
   
   // 添加到 localeConfig 对象
   export const localeConfig: Record<Locale, { label: string; name: string; hrefLang: string }> = {
     // ... 现有语言
     NEW_LOCALE: {
       label: 'XX', // 简短标签（1-3个字符）
       name: '语言名称', // 完整语言名称
       hrefLang: 'new-locale', // BCP 47 语言标签
     },
   };
   ```

3. **创建翻译文件**（`i18n/NEW_LOCALE.json`）：

   复制现有的翻译文件（如 `en_US.json`）并翻译所有内容。文件应遵循以下结构：

   ```json
   {
     "site": {
       "title": "您的网站标题",
       "description": "您的网站描述",
       "author": "您的姓名"
     },
     "nav": [
       { "label": "首页", "href": "index.html" },
       { "label": "关于", "href": "about.html" },
       { "label": "联系", "href": "contact.html" }
     ],
     "header": {
       "name": "您的姓名",
       "avatar": "/img/prof_pic.png"
     },
     "hero": {
       "title": "欢迎访问我的网站",
       "subtitle": "您的副标题",
       "description": "您的描述文本..."
     },
     // ... 翻译所有其他部分
   }
   ```

4. **更新内容配置**（`src/content.config.ts`）：

   内容配置通过 `i18n` 集合模式自动支持新语言，此处无需更改。

#### 语言代码规范

- 使用 `ISO 639-1` 语言代码 + `ISO 3166-1 alpha-2` 国家代码格式（如 `en_US`、`zh_CN`）
- 对于没有国家变体的语言，仅使用语言代码（如西班牙语使用 `es`）
- 确保所有配置文件中的语言代码完全一致

### 样式定制

- **颜色与主题**：编辑 `tailwind.config.mjs`
- **全局样式**：编辑 `src/styles/global.css`
- **深色模式**：使用 Tailwind 的 `dark:` 前缀
- **自定义图标**：添加到 `public/assets/css/custom-icons.css`

### 组件说明

所有交互组件位于 `src/components/react/`：

| 组件 | 用途 |
|------|------|
| `HeaderBar.jsx` | 导航头部，含语言切换 |
| `Contact.jsx` | 联系页面与表单 |
| `ErrorBoundary.jsx` | React 组件错误边界 |
| `LanguageSwitcher.jsx` | 语言选择器 |
| `PrimaryNav.jsx` | 主导航 |
| `ThemeToggle.jsx` | 深色/浅色模式切换 |
| `UnderlineEffects.jsx` | 下划线悬停效果 |

## 部署

### 生产环境变量

在您的托管平台上设置这些环境变量：

```env
# EmailJS（联系表单必需）
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics（可选）
PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 脚本命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器（Bun 运行时） |
| `bun run dev:node` | 启动开发服务器（Node.js 运行时） |
| `bun run build` | 构建生产版本（Bun 运行时） |
| `bun run build:node` | 构建生产版本（Node.js 运行时） |
| `bun run preview` | 预览生产构建 |
| `bun run fetch:rss` | 手动抓取 RSS 订阅 |
| `bun run prebuild` | 预构建 RSS 抓取（构建前自动运行） |
| `bun run format` | 使用 Prettier 格式化代码 |
| `bun run format:check` | 检查代码格式 |
| `bun run type-check` | TypeScript 类型检查 |
| `bun run lint` | Astro 代码检查 |
| `bun run clean` | 清理构建产物 |
| `bun run reinstall` | 清理并重新安装依赖 |

## 技术栈

- **框架**：[Astro](https://astro.build/) 5.x
- **UI**：[React](https://react.dev/) 19.x
- **样式**：[Tailwind CSS](https://tailwindcss.com/) 3.x
- **运行时**：[Bun](https://bun.sh/) 1.x（推荐）或 Node.js 18+
- **邮件**：[EmailJS](https://www.emailjs.com/)
- **图标**：[Iconify](https://iconify.design/)（Material Design Icons）
- **内容**：Astro Content Collections with TypeScript validation
- **SEO**：自动生成支持 i18n 的 sitemap.xml 和 robots.txt
- **图片**：Astro Image API with 响应式优化

## 性能

### PageSpeed Insights 结果

<p align="center">
  <strong>桌面版性能</strong><br>
  <img src="public/assets/img/desktop_pagespeed.png" alt="桌面版 PageSpeed Insights" width="600" />
</p>

<p align="center">
  <strong>移动版性能</strong><br>
  <img src="public/assets/img/mobile_pagespeed.png" alt="移动版 PageSpeed Insights" width="600" />
</p>

## 贡献指南

欢迎贡献！提交 PR 前请阅读 [贡献指南](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

<p align="center">
  Made with love by <a href="https://github.com/WayneXuCN">Wenjie Xu</a>
</p>
