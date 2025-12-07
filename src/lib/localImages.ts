import type { ImageMetadata } from 'astro';

/**
 * Index all local images in `src/assets/img/**` so they can be referenced via
 * i18n-friendly string keys (e.g. "/img/prof_pic.png") and still be optimized
 * by `astro:assets`.
 */
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/img/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true }
);

const imageByFileName = new Map<string, ImageMetadata>();

for (const [path, mod] of Object.entries(imageModules)) {
  const fileName = path.split('/').pop();
  if (!fileName) continue;
  imageByFileName.set(fileName, mod.default);
}

function getBaseName(input: string) {
  // Allow keys like:
  // - "prof_pic.png"
  // - "/img/prof_pic.png"
  // - "/assets/img/prof_pic.png" (legacy)
  // - "https://example.com/prof_pic.png" (won't match, but harmless)
  const withoutQuery = input.split('?')[0] ?? input;
  const parts = withoutQuery.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? withoutQuery;
}

export function getLocalImage(fileNameOrPath: string): ImageMetadata | undefined {
  if (!fileNameOrPath) return undefined;
  const base = getBaseName(fileNameOrPath);
  return imageByFileName.get(base);
}
