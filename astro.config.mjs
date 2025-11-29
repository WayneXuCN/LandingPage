import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // 最终部署的链接
  site: 'https://wenjiexu.site',

  // 尾部斜杠策略
  trailingSlash: 'ignore',

  // 静态站点生成
  output: 'static',

  // 集成配置
  integrations: [
    // React 支持
    react(),
    
    // MDX 支持 - 允许在 Markdown 中使用组件
    mdx({
      // 继承 markdown 配置
      extendMarkdownConfig: true,
      // 优化 MDX 输出，加快构建速度
      optimize: true,
    }),
    
    // Tailwind CSS
    tailwind({
      configFile: './tailwind.config.mjs',
    }),
    
    // 图标支持 - 使用 Iconify 图标集
    icon({
      // 可选：指定要包含的图标集
      // include: {
      //   mdi: ['*'],  // Material Design Icons
      //   lucide: ['*'],  // Lucide Icons
      // },
    }),
    
    // 自动生成 sitemap.xml
    sitemap({
      // i18n 配置 - 与项目的多语言设置匹配
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
        },
      },
      // 更新频率
      changefreq: 'weekly',
      // 优先级
      priority: 0.7,
      // 最后修改时间
      lastmod: new Date(),
    }),
    
    // 自动生成 robots.txt
    robotsTxt({
      // 站点地图 URL（会自动使用 sitemap 集成生成的文件）
      sitemap: true,
      // 爬虫策略
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/404'],
        },
      ],
    }),
  ],

  // i18n 国际化配置
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  // Prefetch 预获取配置
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },
  
  // Vite 配置
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
});