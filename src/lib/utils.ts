/**
 * 公共工具函数
 * 提取自各组件中重复使用的通用函数
 */

import type { Locale } from './i18n';

/**
 * 解析内容链接 - 支持内部和外部链接
 * @param href - 原始链接
 * @param lang - 当前语言
 * @returns 处理后的链接
 */
export function resolveContentHref(href: string | undefined | null, lang: Locale = 'zh_CN'): string {
  if (!href) return '#';

  // 外部链接直接返回
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return href;
  }

  // 内部链接处理
  const cleanHref = href.replace(/\.html$/, '').replace(/^\//, '');
  if (cleanHref === 'index' || cleanHref === '') {
    return `/${lang}/`;
  }
  return `/${lang}/${cleanHref}/`;
}

/**
 * 格式化日期
 * @param date - 日期字符串或 Date 对象
 * @param locale - 语言代码
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, locale: Locale = 'zh_CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return d.toLocaleDateString(locale === 'zh_CN' ? 'zh-CN' : 'en-US', options);
}

/**
 * 生成唯一 ID
 * @param prefix - ID 前缀
 * @returns 唯一 ID 字符串
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 节流函数
 * @param fn - 要节流的函数
 * @param limit - 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * 类名合并工具（简化版 clsx）
 * @param classes - 类名数组或条件对象
 * @returns 合并后的类名字符串
 */
export function cn(
  ...classes: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  return classes
    .flatMap(cls => {
      if (!cls) return [];
      if (typeof cls === 'string') return cls;
      return Object.entries(cls)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(' ');
}
