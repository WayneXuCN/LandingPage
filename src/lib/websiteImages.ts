import type { ImageMetadata } from 'astro';

/**
 * Websites 卡片图片映射。
 *
 * 根据 Astro 官方建议：本地图片要放在 src/ 并通过 import（或 import.meta.glob）获得 ImageMetadata
 * 才能被 `astro:assets` 的 <Image /> 优化处理。
 */

type GlobModule = { default: ImageMetadata };

// 注意：这里的相对路径是相对于本文件（src/lib/websiteImages.ts）
const modules = import.meta.glob<GlobModule>('../assets/img/websites/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

const imagesByFilename: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([filePath, mod]) => {
    const filename = filePath.split('/').pop();
    return [filename ?? filePath, mod.default];
  })
);

export function getWebsiteImage(filenameOrPath: string | undefined | null): ImageMetadata | undefined {
  if (!filenameOrPath) return undefined;

  // i18n 里我们将保存为文件名（例如 dashboard.png）。
  // 为了兼容旧值（/assets/img/websites/dashboard.png），这里也做一次兜底解析。
  const filename = filenameOrPath.split('/').pop() ?? filenameOrPath;
  return imagesByFilename[filename];
}
