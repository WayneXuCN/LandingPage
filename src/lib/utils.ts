/**
 * @fileoverview 公共工具函数库
 *
 * 提取自各组件中重复使用的通用函数，包括链接处理、日期格式化、
 * 唯一ID生成、防抖节流和类名合并等功能。
 *
 * @module src/lib/utils
 * @requires ./i18n
 * @since 1.0.0
 */

import type { Locale } from './i18n';

/**
 * 解析内容链接 - 支持内部和外部链接
 *
 * 将原始链接转换为适合多语言网站的格式，自动处理内部链接的
 * 语言前缀，同时保持外部链接不变。
 *
 * @function resolveContentHref
 * @param {string | undefined | null} href - 原始链接
 * @param {Locale} [lang='zh_CN'] - 当前语言代码
 * @returns {string} 处理后的链接
 *
 * @example
 * // 外部链接保持不变
 * resolveContentHref('https://example.com') // 返回: 'https://example.com'
 *
 * // 内部链接添加语言前缀
 * resolveContentHref('/about', 'en_US') // 返回: '/en_US/about/'
 *
 * // 首页链接处理
 * resolveContentHref('/', 'zh_CN') // 返回: '/zh_CN/'
 *
 * // 空链接处理
 * resolveContentHref(null) // 返回: '#'
 */
export function resolveContentHref(
  href: string | undefined | null,
  lang: Locale = 'zh_CN'
): string {
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
 * 格式化日期为本地化字符串
 *
 * 根据指定的语言代码将日期格式化为本地化的字符串表示。
 * 支持日期字符串和 Date 对象作为输入。
 *
 * @function formatDate
 * @param {string | Date} date - 日期字符串或 Date 对象
 * @param {Locale} [locale='zh_CN'] - 语言代码
 * @returns {string} 格式化后的日期字符串，无效日期返回空字符串
 *
 * @example
 * formatDate('2023-12-25', 'zh_CN') // 返回: '2023年12月25日'
 * formatDate(new Date(), 'en_US') // 返回: 'Dec 25, 2023'
 * formatDate('invalid-date') // 返回: ''
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
 *
 * 使用随机数生成器创建带有指定前缀的唯一标识符，
 * 适用于 DOM 元素 ID、表单字段名等场景。
 *
 * @function generateId
 * @param {string} [prefix='id'] - ID 前缀
 * @returns {string} 唯一 ID 字符串
 *
 * @example
 * generateId() // 返回: 'id-abc123'
 * generateId('user') // 返回: 'user-def456'
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 防抖函数
 *
 * 创建一个防抖版本的函数，该函数在指定延迟后执行，
 * 如果在延迟期间再次调用，则重置计时器。
 *
 * @function debounce
 * @template T - 函数类型
 * @param {T} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {(...args: Parameters<T>) => void} 防抖后的函数
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // 快速连续调用只会执行最后一次
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc'); // 只有这次会执行
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
 *
 * 创建一个节流版本的函数，该函数在指定时间间隔内最多执行一次，
 * 忽略间隔内的额外调用。
 *
 * @function throttle
 * @template T - 函数类型
 * @param {T} fn - 要节流的函数
 * @param {number} limit - 时间间隔（毫秒）
 * @returns {(...args: Parameters<T>) => void} 节流后的函数
 *
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 * // 滚动事件最多每 100ms 触发一次
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
 *
 * 将多个类名参数合并为一个字符串，支持字符串、数组和对象格式。
 * 自动过滤 falsy 值和条件为 false 的类名。
 *
 * @function cn
 * @param {...(string | undefined | null | false | Record<string, boolean>)[]} classes - 类名数组或条件对象
 * @returns {string} 合并后的类名字符串
 *
 * @example
 * // 字符串类名
 * cn('class1', 'class2') // 返回: 'class1 class2'
 *
 * // 条件类名
 * cn('base', { active: true, disabled: false }) // 返回: 'base active'
 *
 * // 混合使用
 * cn('btn', { 'btn-primary': isPrimary }, null, 'extra') // 返回: 'btn btn-primary extra'
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
