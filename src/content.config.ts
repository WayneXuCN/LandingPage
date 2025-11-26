/**
 * Content Collections 配置
 * 使用 Astro Content Layer API 管理 i18n 翻译数据
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 导航项 schema
const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  hidden: z.boolean().optional(),
});

// 社交链接 schema
const socialLinkSchema = z.object({
  icon: z.string(),
  url: z.string(),
  title: z.string(),
});

// 网站项 schema
const websiteItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  url: z.string(),
  description: z.string(),
});

// 帖子项 schema
const postItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  url: z.string(),
  description: z.string(),
  pubDate: z.string().optional(), // ISO 8601 格式日期，用于排序
});

// RSS 配置 schema
const rssConfigSchema = z.object({
  enabled: z.boolean(),
  feeds: z.array(
    z.object({
      url: z.string(),
      parser: z.string(),
    })
  ),
  limit: z.number(),
});

// 时间线项 schema
const timelineItemSchema = z.object({
  period: z.string(),
  title: z.string(),
  description: z.string(),
});

// 价值观项 schema
const valueItemSchema = z.object({
  label: z.string(),
  text: z.string(),
});

// 服务项 schema
const serviceItemSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
});

// 联系卡片社交项 schema
const contactSocialItemSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string(),
  handle: z.string(),
});

// 完整的 i18n schema
const i18nSchema = z.object({
  site: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    keywords: z.string(),
    favicon: z.object({
      ico: z.string(),
      appleTouchIcon: z.string(),
    }),
  }),
  nav: z.array(navItemSchema),
  header: z.object({
    avatar: z.string(),
    name: z.string(),
  }),
  hero: z.object({
    subtitle: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  websites: z.object({
    title: z.string(),
    items: z.array(websiteItemSchema),
  }),
  featuredPosts: z.object({
    title: z.string(),
    rss: rssConfigSchema,
    items: z.array(postItemSchema),
    seeAllText: z.string(),
    seeAllUrl: z.string(),
  }),
  footer: z.object({
    copyright: z.string(),
    icp: z.object({
      text: z.string(),
      url: z.string(),
    }),
    mps: z.object({
      text: z.string(),
      url: z.string(),
      logo: z.string(),
    }),
    socialLinks: z.array(socialLinkSchema),
  }),
  about: z.object({
    hero: z.object({
      subtitle: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    timeline: z.object({
      subtitle: z.string(),
      title: z.string(),
      period: z.string(),
      items: z.array(timelineItemSchema),
    }),
    values: z.object({
      subtitle: z.string(),
      title: z.string(),
      items: z.array(valueItemSchema),
      product: z.object({
        subtitle: z.string(),
        title: z.string(),
        description: z.string(),
        linkText: z.string(),
        linkUrl: z.string(),
      }),
    }),
    philosophy: z.object({
      subtitle: z.string(),
      title: z.string(),
      description: z.string(),
      ctaText: z.string(),
      ctaUrl: z.string(),
    }),
  }),
  contact: z.object({
    hero: z.object({
      subtitle: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    cards: z.object({
      email: z.object({
        subtitle: z.string(),
        address: z.string(),
        note: z.string(),
      }),
      social: z.object({
        subtitle: z.string(),
        items: z.array(contactSocialItemSchema),
      }),
    }),
    form: z.object({
      subtitle: z.string(),
      title: z.string(),
      note: z.string(),
    }),
    actions: z.object({
      writeEmail: z.string(),
      copy: z.string(),
      copied: z.string(),
    }),
    formLabels: z.object({
      name: z.string(),
      email: z.string(),
      topic: z.string(),
      message: z.string(),
    }),
    formPlaceholders: z.object({
      name: z.string(),
      email: z.string(),
      message: z.string(),
    }),
    formOptions: z.object({
      consulting: z.string(),
      content: z.string(),
      share: z.string(),
      other: z.string(),
    }),
    formSubmit: z.object({
      default: z.string(),
      sending: z.string(),
      success: z.string(),
      error: z.string(),
    }),
    services: z.object({
      items: z.array(serviceItemSchema),
    }),
  }),
});

// 定义 i18n 集合
const i18n = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/i18n',
  }),
  schema: i18nSchema,
});

// 导出所有集合
export const collections = { i18n };
