# 个人作品集

使用 React 19、Tailwind CSS 3 和 esbuild 构建的个人作品集网站。

## 快速开始

```bash
npm install       # 安装依赖
npm run dev       # 本地开发（监听 JS + CSS）
npm run build     # 生产构建（assets/css + assets/js）
```

> 提交代码或部署前请务必运行一次 `npm run build`，以便生成最新的静态资源。

## 项目结构

```text
├── assets/                # 构建产物，直接给静态服务器使用
│   ├── css/
│   │   ├── custom-icons.css
│   │   └── main.css
│   └── js/
│       ├── app.bundle.js
│       ├── app.bundle.js.map
│       └── underline-effects.js
├── src/                   # 源码目录
│   ├── components/        # React 组件
│   ├── lib/               # 工具与配置
│   └── styles/            # Tailwind 入口与自定义样式
├── *.html                 # 多页面入口（index/about/contact/404）
├── content.json           # 主页动态数据源
├── tailwind.config.js
└── postcss.config.js
```

## 开发约定

- **React 模块化**：`src/components` / `src/lib` 中维护逻辑与组件，构建后输出到 `assets/js/app.bundle.js`。
- **统一样式管线**：所有 Tailwind 与自定义样式写在 `src/styles/main.css`，构建后得到 `assets/css/main.css`。
- **静态页复用**：`about.html`、`contact.html`、`404.html` 等直接引用同一份 CSS/JS，保持体验一致。
- **代码格式化**：使用 Prettier 保持代码风格一致性，提交代码前请运行 `npm run format`。
- **CI & 部署**：GitHub Actions 会执行 `npm ci` + `npm run build`，服务器只需拉取仓库即可使用最新资源。

## 常用脚本

- `npm run dev`：同时监听 React 源码与 Tailwind 样式的改动。
- `npm run build:js`：单独构建 React 代码（esbuild）。
- `npm run build:css`：单独构建 Tailwind（含 PostCSS/Autoprefixer）。
- `npm run watch:*`：分别监听 JS/CSS。
- `npm run format`：使用 Prettier 格式化项目中所有的 JavaScript、JSX、JSON、CSS 和 HTML 文件。
- `npm run format:check`：检查代码是否符合 Prettier 格式化要求，但不实际修改文件。

## 邮件发送功能

联系表单使用 [EmailJS](https://www.emailjs.com/) 实现纯静态邮件发送，无需后端服务。

### 配置步骤

1. **注册 EmailJS**
   - 访问 [EmailJS 官网](https://www.emailjs.com/) 注册账号
   - 创建一个 Email Service（如 Gmail）
   - 创建一个 Email Template，确保模板变量名与表单字段一致：
     - `{{user_name}}` 对应 `name="user_name"`
     - `{{user_email}}` 对应 `name="user_email"`
     - `{{topic}}` 对应 `name="topic"`
     - `{{message}}` 对应 `name="message"`

2. **获取配置信息**
   - Service ID：在 Email Services 页面获取
   - Template ID：在 Email Templates 页面获取
   - Public Key：在 Account -> General 页面获取

3. **配置环境变量**
   - 在项目根目录的 `.env` 文件中添加：

     ```env
     EMAILJS_SERVICE_ID=your_service_id
     EMAILJS_TEMPLATE_ID=your_template_id
     EMAILJS_PUBLIC_KEY=your_public_key
     ```

4. **部署配置**
   - **本地开发**：直接运行 `npm run dev`，环境变量会自动加载
   - **服务器部署**：在部署平台（如 Vercel/Netlify）的环境变量设置中添加上述三个变量
