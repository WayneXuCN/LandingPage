/**
 * @fileoverview HeaderBar.jsx
 * @description 头部组件，包含头像、名称、导航、主题切换和语言切换功能
 * @author Wenjie
 * @version 1.0.0
 */

import PrimaryNav from './PrimaryNav.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

/**
 * HeaderBar 组件
 * @description 页面头部组件，展示用户头像、名称和导航菜单
 * @param {Object} props - 组件属性
 * @param {Object} props.header - 头部信息
 * @param {string} [props.header.avatar='/assets/img/prof_pic.png'] - 头像图片URL
 * @param {string} [props.header.name=''] - 用户名称
 * @param {Array} props.nav - 导航菜单项数组
 * @param {string} [props.currentPath='/'] - 当前页面路径
 * @param {string} [props.lang='en_US'] - 当前语言代码
 * @returns {JSX.Element} 头部组件
 */
const HeaderBar = ({ header, nav, currentPath = '/', lang = 'en_US' }) => {
  const avatarUrl = header?.avatar || '/assets/img/prof_pic.png';
  const name = header?.name || '';

  return (
    <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 sm:mb-16 md:mb-20 animate-fade-in'>
      <div className='flex items-center'>
        <img
          src={avatarUrl}
          alt={name}
          width={56}
          height={56}
          className='w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4 shadow-sm object-cover'
          loading='eager'
          decoding='sync'
          fetchpriority='high'
        />
        <span className='font-medium text-gray-900 dark:text-white text-lg tracking-tight'>
          {name}
        </span>
      </div>
      <div className='flex flex-wrap justify-center items-center gap-y-4 gap-x-4 sm:gap-8'>
        <PrimaryNav nav={nav} currentPath={currentPath} lang={lang} />
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
