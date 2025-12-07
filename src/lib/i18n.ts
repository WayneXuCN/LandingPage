/**
 * i18n 工具函数
 */
import { getCollection } from 'astro:content';

// 支持的语言列表
export const locales = ['zh_CN', 'en_US'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'zh_CN';

// 语言元数据配置
export const localeConfig: Record<Locale, { label: string; name: string; hrefLang: string }> = {
  zh_CN: {
    label: '中',
    name: '简体中文',
    hrefLang: 'zh-CN',
  },
  en_US: {
    label: 'EN',
    name: 'English',
    hrefLang: 'en-US',
  },
};

/**
 * 从内容集合获取指定语言的翻译数据
 * @param locale - 语言代码 ('zh_CN' | 'en_US')
 * @returns 翻译数据对象
 */
export async function getI18n(locale: Locale) {
  // 将语言代码转换为小写形式以满足内容集合的 ID 兼容性需求
  const contentId = locale.toLowerCase();

  // 获取 i18n 内容集合
  const collection = await getCollection('i18n');
  const entry = collection.find((e: { id: string }) => e.id === contentId);

  if (!entry) {
    // 如果指定语言的 i18n 数据不存在，则使用默认语言作为回退
    const defaultContentId = defaultLocale.toLowerCase();
    const fallback = collection.find((e: { id: string }) => e.id === defaultContentId);
    if (!fallback) {
      throw new Error(`Missing i18n data for ${locale}`);
    }
    return fallback.data;
  }
  return entry.data;
}

/**
 * 获取所有可用的翻译
 * @returns 所有语言的翻译数据
 */
export async function getAllI18n() {
  // 获取 i18n 内容集合
  const collection = await getCollection('i18n');
  return Object.fromEntries(
    collection.map((entry: { id: string; data: unknown }) => [entry.id, entry.data])
  ) as Record<Locale, Awaited<ReturnType<typeof getI18n>>>;
}

/**
 * 验证语言代码是否有效
 * @param locale - 待验证的语言代码
 * @returns 是否是有效的语言代码
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * 获取语言的显示标签
 * @param locale - 语言代码
 * @returns 语言标签
 */
export function getLocaleLabel(locale: Locale): string {
  return localeConfig[locale]?.label || locale.toUpperCase();
}

/**
 * 获取语言的完整名称
 * @param locale - 语言代码
 * @returns 语言名称
 */
export function getLocaleName(locale: Locale): string {
  return localeConfig[locale]?.name || locale;
}

/**
 * 获取语言的 hrefLang 属性值
 * @param locale - 语言代码
 * @returns hrefLang 值
 */
export function getHrefLang(locale: Locale): string {
  return localeConfig[locale]?.hrefLang || locale;
}

/**
 * 从 URL 路径中提取语言代码
 * @param pathname - URL 路径
 * @returns 语言代码
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

/**
 * 生成指定语言的 URL 路径
 * @param path - 原始路径（不含语言前缀）
 * @param locale - 目标语言
 * @returns 带语言前缀的路径
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\//, '');
  // 移除可能存在的语言前缀
  const pathWithoutLocale = cleanPath.replace(/^(zh_CN|en_US)\//, '');
  // 构建新路径
  return `/${locale}/${pathWithoutLocale}`;
}

/**
 * 获取当前语言的替代语言列表
 * @param currentLocale - 当前语言
 * @returns 其他可用语言列表
 */
export function getAlternateLocales(currentLocale: Locale): Locale[] {
  return locales.filter(l => l !== currentLocale);
}
