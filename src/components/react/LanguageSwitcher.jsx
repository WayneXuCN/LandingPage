/**
 * LanguageSwitcher.jsx (Astro React Island 版本)
 * 语言切换按钮，用于在 /en_US/ 和 /zh_CN/ 之间切换
 *
 * 更新：
 * - 支持 View Transitions 的 navigate API
 * - 使用 astro:transitions/client 实现平滑的语言切换
 *
 * 参考文档：
 * - View Transitions Guide - Trigger navigation
 * - Internationalization (i18n) Routing
 */
import { useCallback } from 'react';

const locales = {
  zh_CN: { label: '中', path: '/zh_CN/' },
  en_US: { label: 'EN', path: '/en_US/' },
};

const LanguageSwitcher = ({ currentLang = 'en_US' }) => {
  // 确保 currentLang 在 locales 中有定义
  const safeCurrentLang = locales[currentLang] ? currentLang : 'en_US';

  // 获取下一个语言
  const getNextLang = () => {
    const localeKeys = Object.keys(locales);
    const currentIndex = localeKeys.indexOf(safeCurrentLang);
    const nextIndex = (currentIndex + 1) % localeKeys.length;
    return localeKeys[nextIndex];
  };

  const nextLang = getNextLang();
  const nextLabel = locales[nextLang].label;
  const currentLabel = locales[safeCurrentLang].label;

  const handleSwitch = useCallback(async () => {
    // 获取当前路径并替换语言前缀
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en_US|zh_CN)\//, '/');
    const newPath = `/${nextLang}${pathWithoutLang}`;

    // 普通导航（更轻量，避免为 View Transitions 引入额外 JS）
    window.location.href = newPath;
  }, [nextLang]);

  return (
    <button
      onClick={handleSwitch}
      className='ml-4 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-gray-500'
      aria-label={`当前语言: ${currentLabel}, 切换到: ${nextLabel}`}
      title={`切换到 ${nextLabel}`}
    >
      {nextLabel}
    </button>
  );
};

export default LanguageSwitcher;
