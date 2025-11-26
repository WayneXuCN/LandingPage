# Simple Landing Page

[English](README.md) | [中文](README_zh.md)

A minimalist personal landing page and digital business card built with **Astro 5**, **React 19** and **Tailwind CSS**.

## ✨ Features

- 🌍 **Internationalization**: Chinese/English language support with per-locale static pages
- 🌙 **Dark Mode**: Theme switching with system preference detection and localStorage persistence
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 📡 **RSS Aggregation**: Configurable RSS/Atom feed parser with Bun runtime support
- 📧 **Contact Form**: Functional contact form using EmailJS
- 📊 **Analytics**: Google Analytics integration (optional)
- 🚀 **Performance Optimized**: Static site generation with Lighthouse-optimized scores
- 🎨 **Modern UI**: Clean, professional design with smooth animations and transitions
- ⚡ **React Islands**: Interactive components powered by Astro's islands architecture

## Preview

![Website Preview](public/assets/img/website.png)

## Lighthouse PageSpeed Insights

### Desktop

[![Google Lighthouse PageSpeed Insights](public/assets/img/desktop_pagespeed.png)](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=desktop)

Run the test yourself: [Google Lighthouse PageSpeed Insights](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=desktop)

### Mobile

[![Google Lighthouse PageSpeed Insights](public/assets/img/mobile_pagespeed.png)](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=mobile)

Run the test yourself: [Google Lighthouse PageSpeed Insights](https://pagespeed.web.dev/analysis/https-www-wenjiexu-site/b7dpi427wf?form_factor=mobile)

## Project Structure

```text
src/
├── components/
│   └── astro/           # React island components
│       ├── About.jsx    # About page component
│       ├── Contact.jsx  # Contact page component
│       ├── Footer.jsx   # Footer component
│       ├── HeaderBar.jsx # Header with navigation
│       ├── Home.jsx     # Home page component
│       ├── Hero.jsx     # Hero section
│       ├── ThemeToggle.jsx # Theme switcher
│       ├── LanguageSwitcher.jsx # Language switcher
│       └── ...          # Other UI components
├── data/
│   └── rss-posts.json   # Generated RSS feed data
├── layouts/
│   └── BaseLayout.astro # Global layout with meta, fonts, GA
├── locales/             # Internationalization files
│   ├── config.js        # Locale configuration
│   ├── en.json          # English content
│   └── zh.json          # Chinese content
├── pages/
│   ├── index.astro      # Root redirect to default locale
│   ├── 404.astro        # Custom 404 page
│   ├── en/              # English pages
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── contact.astro
│   └── zh/              # Chinese pages
│       ├── index.astro
│       ├── about.astro
│       └── contact.astro
├── styles/
│   └── global.css       # Global styles
└── scripts/
    └── fetch-rss.bun.js # RSS aggregation script (Bun)
```

## Development

### Prerequisites

- [Bun](https://bun.sh/) 1.0+ (recommended)
- Or Node.js 18+

### Setup

1. **Clone and install dependencies**:

   ```bash
   git clone https://github.com/WayneXuCN/homepage.git
   cd homepage
   bun install
   ```

2. **Configure environment variables**:

   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # EmailJS (required for contact form)
   PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here

   # Google Analytics (optional)
   PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Run development server**:

   ```bash
   bun run dev
   ```

   Open [http://localhost:4321](http://localhost:4321) to view it in the browser.

## Build & Deploy

### Static Export

The project is configured for static site generation:

```bash
bun run build
```

The static files will be generated in the `dist/` directory and can be deployed to any static hosting service (GitHub Pages, Vercel, Netlify, Cloudflare Pages, etc.).

### Build Process

The build includes an automatic RSS aggregation step:

1. **Pre-build**: `bun run prebuild` executes `bun run scripts/fetch-rss.bun.js`
2. **RSS Fetching**: Fetches configured RSS/Atom feeds and generates `src/data/rss-posts.json`
3. **Static Generation**: Astro builds the static site with RSS data included

## Configuration

### Content Management

All website content is managed through JSON files in `src/locales/`:

- `src/locales/zh.json` - Chinese content
- `src/locales/en.json` - English content

Edit these files to update:

- Text and labels
- Navigation links
- Project items
- Social links
- SEO metadata

### Adding a New Language

1. Add language config to `src/locales/config.js`:

   ```js
   export const localeConfig = {
     // ... existing languages
     ja: {
       label: '日本語',
       name: 'Japanese',
       hrefLang: 'ja',
     },
   };
   ```

2. Create `src/locales/ja.json` with translated content

3. Create pages in `src/pages/ja/` directory:
   - `index.astro`
   - `about.astro`
   - `contact.astro`

### RSS Configuration

RSS feeds are configured in the locale files under `featuredPosts.rss`:

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
      "limit": 6
    }
  }
}
```

**Available parsers**:

- `default`: Standard RSS/Atom parser
- `jekyllFeed`: Enhanced parser for Jekyll-generated feeds

### EmailJS Setup

For the contact form to work:

1. Create an [EmailJS](https://www.emailjs.com/) account
2. Set up an email service
3. Create an email template with variables: `user_name`, `user_email`, `topic`, `message`
4. Update environment variables with your EmailJS credentials

### Theme Customization

- **Colors**: Modify Tailwind configuration in `tailwind.config.mjs`
- **Fonts**: Update font settings in `src/layouts/BaseLayout.astro`
- **Dark Mode**: Automatically supported via `dark:` variants

## Available Scripts

```bash
# Development
bun run dev              # Start development server (port 4321)
bun run build            # Build for production (includes RSS fetching)
bun run preview          # Preview production build

# RSS Management
bun run fetch:rss        # Manually fetch RSS feeds

# Testing
bun run test             # Run Playwright tests
bun run test:e2e         # Run E2E tests (Chromium only)
bun run test:headed      # Run tests in headed mode
bun run test:ui          # Run tests with UI

# Code Quality
bun run format           # Format code with Prettier
bun run format:check     # Check code formatting
```

## Technology Stack

- **Framework**: [Astro](https://astro.build/) 5.x
- **UI Library**: [React](https://react.dev/) 19.x (Islands)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.x
- **Runtime**: [Bun](https://bun.sh/) 1.x
- **Testing**: [Playwright](https://playwright.dev/)
- **Email**: [EmailJS](https://www.emailjs.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation if needed
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
