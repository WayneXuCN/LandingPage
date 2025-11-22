# Simple Portfolio

[English](README.md) | [中文](README_zh.md)

A modern, responsive personal portfolio website built with **Next.js 16** and **Tailwind CSS**.

## ✨ Features

- 🌍 **Internationalization**: Chinese/English language support with React Context
- 🌙 **Dark Mode**: Theme switching with system preference detection and localStorage persistence
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 📡 **RSS Aggregation**: Configurable RSS/Atom feed parser with multiple engine support
- 📧 **Contact Form**: Functional contact form using EmailJS
- 📊 **Analytics**: Google Analytics integration (optional)
- 🚀 **Performance Optimized**: Static site generation with Lighthouse-optimized scores
- 🎨 **Modern UI**: Clean, professional design with smooth animations and transitions

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
├── app/                 # Next.js App Router
│   ├── (main)/          # Main route group with Header/Footer
│   │   ├── about/       # About page
│   │   ├── contact/     # Contact page
│   │   └── page.jsx     # Home page
│   ├── globals.css      # Global styles
│   ├── layout.jsx       # Root layout (Providers, fonts, analytics)
│   └── not-found.jsx    # 404 page with isolated layout
├── components/
│   ├── layout/          # Layout components
│   ├── pages/           # Page-specific components (Home, About, Contact)
│   └── ui/              # Reusable UI components
├── data/                # Dynamic data (RSS posts)
│   └── rss-posts.json   # Generated RSS feed data
├── lib/                 # Context providers and utilities
│   ├── LanguageContext.jsx    # Language state management
│   └── ThemeContext.jsx       # Theme state management
├── locales/             # Internationalization files
│   ├── config.js        # Locale configuration
│   ├── en.json          # English content
│   └── zh.json          # Chinese content
├── scripts/             # Build scripts
│   └── fetch-rss.js     # RSS aggregation script
└── styles/              # Additional styles
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Clone and install dependencies**:

   ```bash
   git clone https://github.com/WayneXuCN/homepage.git
   cd homepage
   npm install
   ```

2. **Configure environment variables**:

   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # EmailJS (required for contact form)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here

   # Google Analytics (optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Build & Deploy

### Static Export

The project is configured for static site generation:

```bash
npm run build
```

The static files will be generated in the `out/` directory and can be deployed to any static hosting service (GitHub Pages, Vercel, Netlify, etc.).

### Build Process

The build includes an automatic RSS aggregation step:

1. **Pre-build**: `npm run prebuild` executes `node scripts/fetch-rss.js`
2. **RSS Fetching**: Fetches configured RSS/Atom feeds and generates `src/data/rss-posts.json`
3. **Static Generation**: Next.js builds the static site with RSS data included

## Configuration

### Content Management

All website content is managed through JSON files in `src/locales/`, supporting multiple languages, for example:

- `src/locales/example.zh.json` - Chinese content
- `src/locales/example.en.json` - English content

Edit these files to update:

- Text and labels
- Navigation links
- Project items
- Social links
- SEO metadata

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
      "limit": 4
    }
  }
}
```

**Available parsers**:

- `default`: Standard RSS/Atom parser
- `jekyllFeed`: Enhanced parser for Jekyll-generated feeds

### RSS Script Options

The RSS aggregation script (`scripts/fetch-rss.js`) supports:

- Multiple feeds aggregation
- Multiple parser engines with fallback
- Automatic duplicate removal
- Category/tag extraction

### EmailJS Setup

For the contact form to work:

1. Create an [EmailJS](https://www.emailjs.com/) account
2. Set up an email service
3. Create an email template with variables: `user_name`, `user_email`, `topic`, `message`
4. Update environment variables with your EmailJS credentials

### Theme Customization

- **Colors**: Modify Tailwind configuration in `tailwind.config.js`
- **Fonts**: Update font paths and weights in the same config
- **Dark Mode**: Automatically supported via `dark:` variants

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production (includes RSS fetching)

# RSS Management
npm run fetch:rss        # Manually fetch RSS feeds
npm run prebuild         # RSS fetching (runs automatically before build)

# Code Quality
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation if needed
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
