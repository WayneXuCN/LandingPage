/**
 * @fileoverview 网站展示图片资源管理工具
 *
 * 此模块专门用于管理网站展示卡片中使用的图片资源，提供图片的
 * 索引和访问功能，确保图片能够被 Astro 的资源优化系统处理。
 *
 * 根据 Astro 官方建议：本地图片要放在 src/ 目录下，并通过 import
 * 或 import.meta.glob 获得 ImageMetadata，才能被 astro:assets 的
 * <Image /> 组件优化处理。
 *
 * @module src/lib/websiteImages
 * @requires astro
 * @since 1.0.0
 */

import type { ImageMetadata } from 'astro';

/**
 * 全局模块类型定义
 *
 * 定义通过 import.meta.glob 导入的图片模块结构，
 * 每个模块都包含一个 default 属性，值为 ImageMetadata。
 */
interface GlobModule {
  default: ImageMetadata;
}

/**
 * 预加载所有网站展示图片资源
 *
 * 使用 import.meta.glob 预加载 src/assets/img/websites/ 目录下的所有图片文件。
 * eager: true 选项确保所有图片在模块加载时就被导入，而不是按需加载。
 *
 * 注意：这里的相对路径是相对于本文件（src/lib/websiteImages.ts）
 */
const modules: Record<string, GlobModule> = import.meta.glob<GlobModule>(
  '../assets/img/websites/*.{png,jpg,jpeg,webp,avif}',
  {
    eager: true,
  }
);

/**
 * 图片文件名到 ImageMetadata 的映射表
 *
 * 将所有导入的图片模块转换为以文件名为键的映射表，
 * 提供高效的图片查找功能。
 *
 * @type {Record<string, ImageMetadata>}
 * @constant
 */
const imagesByFilename: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([filePath, mod]) => {
    const filename = filePath.split('/').pop();
    return [filename ?? filePath, mod.default];
  })
);

/**
 * 获取网站展示图片的元数据
 *
 * 根据文件名或路径查找并返回对应的图片元数据。
 * 支持多种输入格式，包括纯文件名和完整路径，确保与
 * i18n 配置和旧版本数据的兼容性。
 *
 * @function getWebsiteImage
 * @param {string | undefined | null} filenameOrPath - 图片文件名或路径
 * @returns {ImageMetadata | undefined} 图片元数据，如果图片不存在则返回 undefined
 *
 * @example
 * // 使用文件名（推荐方式）
 * const image = getWebsiteImage("dashboard.png");
 *
 * // 使用完整路径（兼容旧版）
 * const image = getWebsiteImage("/assets/img/websites/dashboard.png");
 *
 * // 处理空值
 * const image = getWebsiteImage(null); // 返回: undefined
 */
export function getWebsiteImage(
  filenameOrPath: string | undefined | null
): ImageMetadata | undefined {
  if (!filenameOrPath) return undefined;

  // 在 i18n 配置中，我们保存为文件名（例如 dashboard.png）。
  // 为了兼容旧值（/assets/img/websites/dashboard.png），这里也做一次兜底解析。
  const filename = filenameOrPath.split('/').pop() ?? filenameOrPath;
  return imagesByFilename[filename];
}
