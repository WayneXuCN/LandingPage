import React from 'react';
import PropTypes from 'prop-types';

/**
 * 解析内容链接 - 支持内部和外部链接
 * @param {string} href - 原始链接
 * @returns {string} - 处理后的链接
 */
const resolveContentHref = href => {
  if (!href) return '#';
  // 外部链接直接返回
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  // 内部链接确保以 / 开头
  return href.startsWith('/') ? href : `/${href}`;
};

/**
 * WebsiteItem
 * 网站卡片组件 - 极简导航风格
 * 响应式设计：
 * - 移动端 (<640px): 水平布局 (左图右文)，更紧凑
 * - 平板/桌面 (>=640px): 垂直布局 (上图下文)，更美观
 */
const WebsiteItem = ({ item, priority = false }) => (
  <a
    href={resolveContentHref(item.url)}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={`访问 ${item.title}: ${item.description}`}
    className='group flex flex-row sm:flex-col gap-4 sm:gap-3 p-3 -mx-3 sm:mx-0 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-300 items-center sm:items-stretch'
  >
    {/* 图片容器：移动端固定宽度，桌面端自适应 */}
    <div className='relative w-24 sm:w-full shrink-0 aspect-[16/9] overflow-hidden rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-all duration-300'>
      {/* 使用标准 img 标签替代 next/image */}
      <img
        src={item.image}
        alt={item.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding='async'
        fetchPriority={priority ? 'high' : 'auto'}
        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        sizes='(max-width: 640px) 96px, (max-width: 768px) 50vw, 25vw'
      />
      {/* 极轻微的内阴影，增加层次感 */}
      <div className='absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-lg sm:rounded-xl' />
    </div>

    <div className='flex flex-col min-w-0 flex-grow px-0 sm:px-1'>
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate pr-2'>
          {item.title}
        </h3>
        <svg
          className='w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300 hidden sm:block'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
          />
        </svg>
      </div>

      <p className='mt-0.5 sm:mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed'>
        {item.description}
      </p>
    </div>
  </a>
);

WebsiteItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  priority: PropTypes.bool,
};

export default React.memo(WebsiteItem);
