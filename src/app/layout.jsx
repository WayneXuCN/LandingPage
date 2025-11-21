import React from 'react';
import { LanguageProvider } from '../lib/LanguageContext';
import { ThemeProvider } from '../lib/ThemeContext';
import UnderlineEffects from '../components/ui/UnderlineEffects';
import contentData from '../../content.json';
import './globals.css';

// 获取默认语言的元数据
const getDefaultMetadata = () => {
  const defaultLang = 'zh';
  const siteData = contentData[defaultLang]?.site || contentData.en?.site || {};
  const favicon = siteData.favicon || {};
  
  return {
    title: siteData.title || 'Portfolio',
    description: siteData.description || 'Personal Portfolio Website',
    icons: {
      icon: favicon.ico || '/favicon.ico',
      apple: favicon.appleTouchIcon || '/apple-touch-icon.png',
    },
  };
};

export const metadata = getDefaultMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link rel="stylesheet" href="/assets/css/custom-icons.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <UnderlineEffects />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
