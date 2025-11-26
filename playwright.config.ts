import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* 并行运行测试 */
  fullyParallel: true,
  /* CI 环境下禁止仅运行 test.only */
  forbidOnly: !!process.env.CI,
  /* CI 环境下重试失败的测试 */
  retries: process.env.CI ? 2 : 0,
  /* CI 环境下使用较少的 worker */
  workers: process.env.CI ? 1 : undefined,
  /* 测试报告 */
  reporter: process.env.CI ? 'github' : 'html',
  /* 全局测试配置 */
  use: {
    /* 基础 URL */
    baseURL: 'http://localhost:4321',
    /* 截图设置 */
    screenshot: 'only-on-failure',
    /* 追踪设置 */
    trace: 'on-first-retry',
  },

  /* 配置测试项目 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* 本地开发时启动开发服务器 */
  webServer: {
    command: 'bun run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
