/**
 * i18n 配置文件
 * 添加新语言只需：
 * 1. 在 localeConfig 中添加配置
 * 2. 创建对应的 {lang}.json 文件
 * 3. 在 src/pages/{lang}/ 目录下创建页面
 */

// 导入所有语言数据（静态导入，避免动态导入警告）
import zh from './zh.json';
import en from './en.json';

// 语言数据映射
const localeData = { zh, en };

// 语言配置（静态元数据）
export const localeConfig = {
  zh: {
    label: '中',
    name: '中文',
    hrefLang: 'zh-CN',
  },
  en: {
    label: 'EN',
    name: 'English',
    hrefLang: 'en',
  },
};

// 支持的语言代码列表
export const supportedLocales = Object.keys(localeConfig);

// 默认语言
export const defaultLocale = 'zh';

/**
 * 同步获取 locale 数据
 * @param {string} lang - 语言代码
 * @returns {object} - locale 数据
 */
export function getLocaleDataSync(lang) {
  return localeData[lang] || localeData[defaultLocale];
}

/**
 * 获取完整的 locale 配置（包含数据）
 * 向后兼容旧 API
 */
export const locales = Object.fromEntries(
  supportedLocales.map(lang => [
    lang,
    {
      ...localeConfig[lang],
      data: localeData[lang],
    },
  ])
);
