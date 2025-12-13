/**
 * @fileoverview LanguageSwitcher.jsx
 * @description 语言切换按钮组件，用于在 /en_US/ 和 /zh_CN/ 之间切换
 * @author Wenjie
 * @version 1.0.0
 */
import { useCallback } from 'react';

/**
 * 支持的语言配置
 * @description 定义支持的语言及其标签和路径
 * @type {Object.<string, {label: string, path: string}>}
 */
const locales = {
  zh_CN: { label: '中', path: '/zh_CN/' },
  en_US: { label: 'EN', path: '/en_US/' },
};

/**
 * LanguageSwitcher 组件
 * @description 语言切换按钮，用于在不同语言版本之间切换
 * @param {Object} props - 组件属性
 * @param {string} [props.currentLang='en_US'] - 当前语言代码
 * @returns {JSX.Element} 语言切换按钮
 */
const LanguageSwitcher = ({ currentLang = 'en_US' }) => {
  // 确保 currentLang 在 locales 中有定义
  const safeCurrentLang = locales[currentLang] ? currentLang : 'en_US';

  /**
   * 获取下一个语言代码
   * @description 根据当前语言计算下一个要切换的语言
   * @returns {string} 下一个语言代码
   */
  const getNextLang = () => {
    const localeKeys = Object.keys(locales);
    const currentIndex = localeKeys.indexOf(safeCurrentLang);
    const nextIndex = (currentIndex + 1) % localeKeys.length;
    return localeKeys[nextIndex];
  };

  const nextLang = getNextLang();
  const nextLabel = locales[nextLang].label;
  const currentLabel = locales[safeCurrentLang].label;

  /**
   * 处理语言切换
   * @description 点击按钮时切换到下一个语言，保持当前页面路径
   * @returns {Promise<void>}
   */
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
