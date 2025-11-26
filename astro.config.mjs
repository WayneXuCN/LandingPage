import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // 静态站点生成
  output: 'static',
  
  // 尾部斜杠策略
  trailingSlash: 'always',
  
  // 站点基础配置
  site: 'https://example.com', // TODO: 在部署时更新为实际域名
  
  // 集成配置
  integrations: [
    react(),
    tailwind({
      // 使用自定义配置文件
      configFile: './tailwind.config.mjs',
    }),
  ],
  
  // Vite 配置
  vite: {
    // 优化依赖预构建
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
});
