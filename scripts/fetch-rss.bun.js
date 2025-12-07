#!/usr/bin/env bun
/**
 * @fileoverview RSS/Atom Feed 抓取与解析脚本
 * @name fetch-rss.bun.js
 * @version 2.0.0
 * @author LandingPage Team
 * @description
 *
 * 本脚本用于从多个 RSS/Atom 源抓取文章数据，并将其转换为统一格式供前端使用。
 *
 * 主要功能：
 * 1. 从国际化配置文件中读取 RSS 源配置 (i18n/zh_CN.json, i18n/en_US.json)
 * 2. 使用 Bun 原生 fetch API 并发抓取 RSS/Atom feeds
 * 3. 解析 XML 内容并提取文章元数据（标题、链接、描述、发布日期、分类等）
 * 4. 基于文章 URL 和标题生成确定性哈希值，用于获取一致的随机图片
 * 5. 将处理后的数据输出为 JSON 格式到 src/data/rss-posts.json
 *
 * 支持的 RSS 格式：
 * - RSS 2.0
 * - Atom 1.0
 * - 特定主题格式（如 Astro Paper）
 *
 * 使用方法：
 *   bun run scripts/fetch-rss.bun.js
 *
 * 输出格式：
 * {
 *   "zh_CN": [
 *     {
 *       "id": "rss-zh_CN-0-abc12345",
 *       "title": "文章标题",
 *       "description": "文章描述...",
 *       "url": "https://example.com/article",
 *       "image": "https://picsum.photos/seed/abc12345/600/350.jpg",
 *       "pubDate": "2023-01-01T00:00:00.000Z",
 *       "categories": ["技术", "前端"],
 *       "category": "技术",
 *       "tags": ["前端"],
 *       "overlayColor": "bg-black",
 *       "overlayOpacity": "bg-opacity-70",
 *       "isRSS": true
 *     }
 *   ],
 *   "en_US": [...]
 * }
 */

import { file, write } from 'bun';
import { resolve, join } from 'path';

// ============================================================================
// 常量配置
// ============================================================================

/** 当前脚本所在目录路径 */
const SCRIPT_DIR = import.meta.dir;

/** 项目根目录路径 */
const PROJECT_ROOT = import.meta.dirname + '/..';

/** 国际化配置文件目录路径 */
const I18N_DIR = join(PROJECT_ROOT, 'i18n');

/** 输出文件路径 */
const OUTPUT_PATH = join(PROJECT_ROOT, 'src/data/rss-posts.json');

/** HTTP 请求 User-Agent 标识 */
const USER_AGENT = 'LandingPage-RSS-Fetcher/2.0 (Bun; +https://waynexucn.github.io)';

/** 网络请求超时时间（毫秒） */
const FETCH_TIMEOUT = 15000;

/** 网络请求最大重试次数 */
const MAX_RETRIES = 3;

/** 支持的语言代码列表 */
const SUPPORTED_LANGUAGES = ['zh_CN', 'en_US'];

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成确定性哈希值
 * @description 使用 Bun 原生的 CryptoHasher 生成 MD5 哈希值，用于生成一致的随机图片种子
 * @param {string} str - 需要哈希的字符串
 * @returns {string} 8位十六进制哈希值
 */
function getHash(str) {
  const hasher = new Bun.CryptoHasher('md5');
  hasher.update(str);
  return hasher.digest('hex').substring(0, 8);
}

/**
 * 带重试机制和超时控制的网络请求函数
 * @description 实现指数退避重试策略，提高网络请求的可靠性
 * @param {string} url - 请求的 URL
 * @param {object} options - 请求选项
 * @param {number} options.retries - 最大重试次数，默认为 MAX_RETRIES
 * @param {number} options.timeout - 超时时间（毫秒），默认为 FETCH_TIMEOUT
 * @returns {Promise<string>} 响应文本内容
 * @throws {Error} 当所有重试均失败时抛出错误
 */
async function fetchWithRetry(url, options = {}) {
  const { retries = MAX_RETRIES, timeout = FETCH_TIMEOUT } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);

      const isAborted = error.name === 'AbortError';
      const errorMsg = isAborted ? '请求超时' : error.message;

      if (attempt < retries) {
        const delay = 500 * Math.pow(2, attempt - 1);
        console.warn(`  ⚠️ 尝试 ${attempt}/${retries} 失败: ${errorMsg}，${delay}ms 后重试...`);
        await Bun.sleep(delay);
      } else {
        throw new Error(`抓取失败 (${retries} 次尝试后): ${errorMsg}`);
      }
    }
  }
}

/**
 * 清理 HTML 标签和 CDATA 段落
 * @description 移除 HTML 标签和 CDATA 标记，返回纯文本内容
 * @param {string} html - 包含 HTML 标签的字符串
 * @returns {string} 清理后的纯文本
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * 从 XML 内容中提取指定标签的内容
 * @description 使用正则表达式匹配标签内容，支持属性和嵌套内容
 * @param {string} xml - XML 字符串
 * @param {string} tagName - 要提取的标签名
 * @returns {string|null} 标签内容，如果未找到则返回 null
 */
function getTagContent(xml, tagName) {
  const regex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (!match) return null;
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
}

/**
 * 从 XML 内容中提取链接地址
 * @description 支持 Atom 格式的 href 属性和 RSS 格式的标签内容
 * @param {string} xml - 包含链接信息的 XML 片段
 * @returns {string} 提取的链接地址，如果未找到则返回 '#'
 */
function getLinkHref(xml) {
  // Atom 风格: <link href="..." />
  const hrefMatch = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (hrefMatch) {
    // 修复双斜杠问题
    return hrefMatch[1].replace(/([^:])(\/\/+)/g, '$1/');
  }

  // RSS 风格: <link>...</link>
  const linkContent = getTagContent(xml, 'link');
  if (linkContent) {
    // 修复双斜杠问题
    return linkContent.replace(/([^:])(\/\/+)/g, '$1/');
  }
  return '#';
}

/**
 * 从 XML 内容中提取所有分类标签
 * @description 支持 Atom 格式的 term 属性和 RSS 格式的标签内容
 * @param {string} xml - 包含分类信息的 XML 片段
 * @returns {string[]} 分类名称数组
 */
function getCategories(xml) {
  const categories = [];

  // Atom: <category term="X" />
  const termRegex = /<category[^>]*term=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = termRegex.exec(xml)) !== null) {
    if (!categories.includes(match[1])) {
      categories.push(match[1]);
    }
  }

  // RSS: <category>X</category>
  const tagRegex = /<category(?:\s+[^>]*)?>([\s\S]*?)<\/category>/gi;
  while ((match = tagRegex.exec(xml)) !== null) {
    const cat = stripHtml(match[1]);
    if (cat && !categories.includes(cat)) {
      categories.push(cat);
    }
  }

  return categories;
}

// ============================================================================
// RSS/Atom 解析器
// ============================================================================

/**
 * 通用 RSS/Atom Feed 解析器
 * @description 使用正则表达式解析 RSS 2.0 和 Atom 1.0 格式的 feed，提取文章条目
 * @param {string} xml - RSS/Atom XML 内容
 * @returns {Array<object>} 解析后的文章条目数组
 */
function parseFeed(xml) {
  const entries = [];

  // 匹配 entry (Atom) 或 item (RSS) 标签
  const entryRegex = /<(entry|item)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi;

  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const content = match[2];

    const title = getTagContent(content, 'title') || 'Untitled';
    const link = getLinkHref(content);
    const description =
      getTagContent(content, 'summary') ||
      getTagContent(content, 'description') ||
      getTagContent(content, 'content') ||
      '';
    const pubDate =
      getTagContent(content, 'updated') ||
      getTagContent(content, 'pubDate') ||
      getTagContent(content, 'published') ||
      null;
    const categories = getCategories(content);

    entries.push({
      title: stripHtml(title),
      url: link,
      description: stripHtml(description),
      pubDate,
      categories,
    });
  }

  return entries;
}

/**
 * Astro Paper 主题专用 RSS 解析器
 * @description 基于 parseFeed 的扩展，将分类拆分为主分类和标签
 * 规则：第一个 category 作为主分类，其余作为 tags
 * @param {string} xml - RSS/Atom XML 内容
 * @returns {Array<object>} 解析后的文章条目数组，包含 category 和 tags 字段
 */
function parseAstroPaper(xml) {
  const entries = parseFeed(xml);

  return entries.map(item => {
    const allCategories = (item.categories || []).map(cat => cat.trim()).filter(Boolean);
    const [mainCategory = 'Uncategorized', ...tags] = allCategories;

    return {
      ...item,
      category: mainCategory,
      tags,
      categories: [mainCategory, ...tags],
    };
  });
}

/**
 * RSS 解析器映射表
 * @description 根据配置中的 parser 名称选择对应的解析函数
 */
const PARSERS = {
  default: parseFeed,
  jekyllFeed: parseFeed,
  astroPaper: parseAstroPaper,
};

// ============================================================================
// 配置读取模块
// ============================================================================

/**
 * 获取支持的语言代码列表
 * @returns {string[]} 支持的语言代码数组
 */
function getLanguages() {
  return SUPPORTED_LANGUAGES;
}

/**
 * 读取指定语言的 RSS 配置
 * @description 从国际化配置文件中提取 RSS 源配置信息
 * @param {string} lang - 语言代码（如 'zh_CN', 'en_US'）
 * @returns {Promise<object|null>} RSS 配置对象，如果文件不存在或读取失败则返回 null
 */
async function getConfig(lang) {
  try {
    const configPath = join(I18N_DIR, `${lang}.json`);
    const configFile = file(configPath);

    if (!(await configFile.exists())) {
      return null;
    }

    const json = await configFile.json();
    return json.featuredPosts?.rss || null;
  } catch (error) {
    console.warn(`⚠️ 读取配置文件 ${lang}.json 失败:`, error.message);
    return null;
  }
}

// ============================================================================
// 主程序入口
// ============================================================================

/**
 * 主函数 - RSS 抓取与处理流程
 * @description 执行完整的 RSS 抓取、解析、处理和输出流程
 */
async function main() {
  console.log('🚀 Bun RSS Fetcher v2.0');
  console.log('========================\n');

  const startTime = performance.now();
  const languages = getLanguages();
  console.log(`📋 检测到支持的语言: ${languages.join(', ')}\n`);

  const allData = {};

  // 按语言处理 RSS 源
  for (const lang of languages) {
    console.log(`\n=== 处理语言: ${lang.toUpperCase()} ===`);

    const config = await getConfig(lang);

    // 获取配置参数
    let feeds = config?.feeds || [];
    const limit = config?.limit || 4;

    if (feeds.length === 0) {
      console.log(`  ℹ️ 未配置 RSS feeds，跳过。`);
      allData[lang] = [];
      continue;
    }

    // 规范化 feeds 配置，支持字符串和对象格式
    feeds = feeds.map(f => (typeof f === 'string' ? { url: f, parser: 'default' } : f));

    console.log(`  📡 开始抓取 ${feeds.length} 个 RSS 源...`);

    let langPosts = [];

    // 逐个处理 RSS 源
    for (const feedConfig of feeds) {
      const { url, parser: parserName = 'default' } = feedConfig;

      try {
        console.log(`  → 抓取: ${url}`);
        const xml = await fetchWithRetry(url);
        const parser = PARSERS[parserName] || PARSERS.default;
        const items = parser(xml);

        console.log(`    ✓ 发现 ${items.length} 篇文章`);
        langPosts = langPosts.concat(items);
      } catch (error) {
        console.error(`    ✗ 失败: ${error.message}`);
      }
    }

    // 根据 URL 去重
    const seen = new Set();
    langPosts = langPosts.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    // 按发布时间倒序排序
    langPosts.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
      const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
      return dateB - dateA;
    });

    // 截取指定数量并格式化输出
    const displayPosts = langPosts.slice(0, limit).map((item, index) => {
      const seed = getHash(item.url + item.title);
      const description =
        item.description.substring(0, 200) + (item.description.length > 200 ? '...' : '');
      const category = item.category || (item.categories?.[0] ?? null);
      const tags = item.tags || (item.categories ? item.categories.slice(1) : []);
      const categories = [category, ...tags].filter(Boolean);

      return {
        id: `rss-${lang}-${index}-${getHash(item.url)}`,
        title: item.title,
        description,
        url: item.url,
        image: `https://picsum.photos/seed/${seed}/600/350.jpg`,
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        categories,
        category,
        tags,
        overlayColor: 'bg-black',
        overlayOpacity: 'bg-opacity-70',
        isRSS: true,
      };
    });

    allData[lang] = displayPosts;
    console.log(`  ✅ 成功处理 ${displayPosts.length} 篇文章`);
  }

  // 写入输出文件
  const outputJson = JSON.stringify(allData, null, 2);
  await write(OUTPUT_PATH, outputJson);

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(`\n========================`);
  console.log(`✅ 完成！数据已写入 ${OUTPUT_PATH}`);
  console.log(`⏱️  耗时: ${elapsed}s`);
}

// 执行主函数并处理异常
main().catch(error => {
  console.error('\n❌ 脚本执行失败:', error);
  process.exit(1);
});
