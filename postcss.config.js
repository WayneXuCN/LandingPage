/**
 * @fileoverview PostCSS 配置文件
 * @module postcss.config
 * @version 1.0.0
 * @author LandingPage Team
 * @since 1.0.0
 * @description 本文件定义了 PostCSS 处理器的插件配置，用于转换和优化 CSS。
 * PostCSS 是一个使用 JavaScript 插件来转换 CSS 代码的工具，可以自动添加浏览器前缀、
 * 使用未来的 CSS 特性、优化 CSS 等功能。
 *
 * @see https://postcss.org/
 * @license MIT
 * @copyright 2023 LandingPage Team
 */

module.exports = {
  /** PostCSS 插件配置：定义要使用的插件及其选项 */
  plugins: {
    /** Tailwind CSS 插件：处理 Tailwind 的工具类并生成对应的 CSS */
    tailwindcss: {},
    /** Autoprefixer 插件：自动添加浏览器厂商前缀，提高跨浏览器兼容性 */
    autoprefixer: {},
  },
};
