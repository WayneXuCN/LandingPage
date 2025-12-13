/**
 * @fileoverview Tailwind CSS 配置文件
 * @module tailwind.config
 * @version 1.0.0
 * @author LandingPage Team
 * @since 1.0.0
 * @description 本文件定义了 Tailwind CSS 框架的配置选项，包括内容扫描路径、主题扩展和插件设置。
 * Tailwind CSS 是一个实用优先的 CSS 框架，通过组合工具类快速构建自定义设计。
 *
 * @see https://tailwindcss.com/docs/configuration
 * @license MIT
 * @copyright 2023 LandingPage Team
 */

/** @type {import('tailwindcss').Config} */
export default {
  /** 内容扫描路径：指定 Tailwind 应该扫描的文件，以生成对应的 CSS 工具类 */
  content: [
    /** 页面组件文件路径 */
    './src/pages/**/*.{astro,js,ts,jsx,tsx,mdx}',
    /** 布局组件文件路径 */
    './src/layouts/**/*.{astro,js,ts,jsx,tsx,mdx}',
    /** 可复用组件文件路径 */
    './src/components/**/*.{astro,js,ts,jsx,tsx,mdx}',
    /** 内容集合文件路径 */
    './src/content/**/*.json',
  ],
  
  /** 暗色模式策略：'class' 通过类名切换，'media' 根据系统偏好自动切换 */
  darkMode: 'class',
  
  /** 主题配置：定义颜色、字体、间距等设计系统变量 */
  theme: {
    /** 扩展默认主题：添加自定义设计令牌而不覆盖现有配置 */
    extend: {
      /** 字体族配置：定义项目中使用的字体堆栈 */
      fontFamily: {
        /** 无衬线字体：优先使用自定义 CSS 变量，回退到系统字体 */
        sans: [
          'var(--font-noto-sans)',  // 自定义字体变量
          'system-ui',              // 系统默认字体
          '-apple-system',          // macOS/iOS 系统字体
          'BlinkMacSystemFont',     // macOS Chrome 字体
          'Segoe UI',               // Windows 系统字体
          'Roboto',                 // Android 系统字体
          'sans-serif'              // 通用无衬线字体
        ],
      },
    },
  },
  
  /** 插件配置：添加额外的功能扩展和自定义工具类 */
  plugins: [],
};
