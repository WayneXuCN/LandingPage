import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Hero from './Hero';
import WebsiteItem from './WebsiteItem';
import FeaturedPostItem from './FeaturedPostItem';
import Footer from './Footer';

/**
 * Home.jsx
 * 首页组件，包含 Hero、Websites、Featured Posts 和 Footer
 */
const Home = ({ translations, language = 'zh', rssPosts = [] }) => {
  const { hero, websites, featuredPosts, footer } = translations;

  // 合并静态帖子和 RSS 数据
  const displayPosts = useMemo(() => {
    const staticPosts = Array.isArray(featuredPosts?.items) ? featuredPosts.items : [];
    const rssItems = Array.isArray(rssPosts) ? rssPosts : [];

    // RSS 帖子标记 isRSS，静态帖子标记 isManual
    const markedRSS = rssItems.map(post => ({ ...post, isRSS: true }));
    const markedStatic = staticPosts.map(post => ({ ...post, isManual: true }));

    // 合并所有帖子
    const combined = [...markedRSS, ...markedStatic];

    // 按发布日期倒序排序
    combined.sort((a, b) => {
      const dateA = new Date(a.pubDate || a.updated || 0);
      const dateB = new Date(b.pubDate || b.updated || 0);
      return dateB - dateA;
    });

    // 限制数量（RSS limit + 静态帖子数量，或单独使用 limit）
    const rssLimit = featuredPosts?.rss?.limit || 6;
    const totalLimit = rssLimit + staticPosts.length;
    return combined.slice(0, Math.max(rssLimit, totalLimit));
  }, [featuredPosts, rssPosts]);

  // 判断是否显示 See All 链接，需要同时满足以下条件：
  // 1. 存在 seeAllUrl 且不是 '#'
  // 2. 存在 seeAllText 且不为空
  const showSeeAll = !!(
    featuredPosts?.seeAllUrl &&
    featuredPosts.seeAllUrl !== '#' &&
    featuredPosts?.seeAllText
  );

  return (
    <>
      {/* Hero 区块 */}
      <Hero subtitle={hero?.subtitle} title={hero?.title} description={hero?.description} />

      {/* Websites 区块 */}
      {websites && websites.items && websites.items.length > 0 && (
        <section className='mb-12 sm:mb-16 md:mb-20'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font'>
            {websites.title || 'Websites'}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
            {websites.items.map((item, index) => (
              <WebsiteItem key={item.id || index} item={item} priority={index < 2} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Posts 区块 */}
      {displayPosts && displayPosts.length > 0 && (
        <section className='mb-12 sm:mb-16 md:mb-20'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 display-font'>
            {featuredPosts?.title || 'Featured Posts'}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8'>
            {displayPosts.map((item, index) => (
              <FeaturedPostItem
                key={item.id || item.url || index}
                item={item}
                language={language}
              />
            ))}
          </div>
          {showSeeAll && (
            <div className='mt-8 flex justify-end'>
              <a
                href={featuredPosts.seeAllUrl}
                className='group inline-flex items-center text-xl font-bold uppercase tracking-wider text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-300'
              >
                {featuredPosts.seeAllText}
                <span className='ml-2 transform group-hover:translate-x-1 transition-transform duration-300'>
                  &rarr;
                </span>
              </a>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <Footer footer={footer} />
    </>
  );
};

Home.propTypes = {
  translations: PropTypes.shape({
    hero: PropTypes.object,
    websites: PropTypes.object,
    featuredPosts: PropTypes.object,
    footer: PropTypes.object,
  }).isRequired,
  language: PropTypes.string,
  rssPosts: PropTypes.array,
};

export default Home;
