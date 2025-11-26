import { test, expect } from '@playwright/test';

/**
 * 页面访问测试
 * 验证所有页面可以正常访问
 */
test.describe('页面访问测试', () => {
  test('根路径重定向到 /zh/', async ({ page }) => {
    await page.goto('/');
    // 应该重定向到 /zh/
    await expect(page).toHaveURL(/\/zh\//);
  });

  test('中文首页可访问', async ({ page }) => {
    await page.goto('/zh/');
    await expect(page).toHaveTitle(/Home/);
    // 检查 HeaderBar 存在
    await expect(page.locator('header, nav, [class*="header"]').first()).toBeVisible();
  });

  test('英文首页可访问', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle(/Home/);
  });

  test('中文关于页可访问', async ({ page }) => {
    await page.goto('/zh/about/');
    await expect(page).toHaveTitle(/关于/);
  });

  test('英文关于页可访问', async ({ page }) => {
    await page.goto('/en/about/');
    await expect(page).toHaveTitle(/About/);
  });

  test('中文联系页可访问', async ({ page }) => {
    await page.goto('/zh/contact/');
    await expect(page).toHaveTitle(/联系/);
  });

  test('英文联系页可访问', async ({ page }) => {
    await page.goto('/en/contact/');
    await expect(page).toHaveTitle(/Contact/);
  });

  test('404 页面正常显示', async ({ page }) => {
    const response = await page.goto('/non-existent-page/');
    // 检查返回 404 状态码
    expect(response?.status()).toBe(404);
  });
});

/**
 * 主题切换测试
 */
test.describe('主题切换测试', () => {
  test('主题切换按钮存在', async ({ page }) => {
    await page.goto('/zh/');
    // 查找主题切换按钮 (aria-label 包含 "模式" 或 "mode")
    const themeButton = page.locator('button[aria-label*="模式"], button[aria-label*="mode"]').first();
    await expect(themeButton).toBeVisible();
  });

  test('点击切换主题', async ({ page }) => {
    await page.goto('/zh/');
    
    // 获取初始状态
    const html = page.locator('html');
    const initialDark = await html.evaluate(el => el.classList.contains('dark'));
    
    // 点击主题切换按钮
    const themeButton = page.locator('button[aria-label*="模式"], button[aria-label*="mode"]').first();
    await themeButton.click();
    
    // 等待状态变化
    await page.waitForTimeout(500);
    
    // 验证主题已切换
    const newDark = await html.evaluate(el => el.classList.contains('dark'));
    expect(newDark).not.toBe(initialDark);
  });
});

/**
 * 语言切换测试
 */
test.describe('语言切换测试', () => {
  test('语言切换按钮存在', async ({ page }) => {
    await page.goto('/zh/');
    // 查找语言切换相关元素
    const langSwitcher = page.locator('a[href*="/en/"], button:has-text("EN"), button:has-text("English")').first();
    await expect(langSwitcher).toBeVisible();
  });

  test('从中文切换到英文', async ({ page }) => {
    await page.goto('/zh/');
    
    // 点击语言切换
    const langSwitcher = page.locator('a[href*="/en/"], button:has-text("EN"), button:has-text("English")').first();
    await langSwitcher.click();
    
    // 验证 URL 变为英文版
    await expect(page).toHaveURL(/\/en\//);
  });
});

/**
 * 导航测试
 */
test.describe('导航测试', () => {
  test('导航链接正确', async ({ page }) => {
    await page.goto('/zh/');
    
    // 检查导航链接
    const aboutLink = page.locator('a[href*="about"]').first();
    const contactLink = page.locator('a[href*="contact"]').first();
    
    await expect(aboutLink).toBeVisible();
    await expect(contactLink).toBeVisible();
  });

  test('点击关于链接跳转正确', async ({ page }) => {
    await page.goto('/zh/');
    
    const aboutLink = page.locator('a[href*="about"]').first();
    await aboutLink.click();
    
    await expect(page).toHaveURL(/\/zh\/about\//);
  });
});

/**
 * 联系表单测试
 */
test.describe('联系表单测试', () => {
  test('联系表单字段存在', async ({ page }) => {
    await page.goto('/zh/contact/');
    
    // 检查表单字段
    await expect(page.locator('input[name="user_name"]')).toBeVisible();
    await expect(page.locator('input[name="user_email"]')).toBeVisible();
    await expect(page.locator('select[name="topic"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('表单验证生效', async ({ page }) => {
    await page.goto('/zh/contact/');
    
    // 尝试提交空表单
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // HTML5 验证应阻止提交
    // 检查必填字段的验证状态
    const nameInput = page.locator('input[name="user_name"]');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

/**
 * 响应式设计测试
 */
test.describe('响应式设计测试', () => {
  test('移动端布局正确', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/zh/');
    
    // 页面应正常渲染
    await expect(page.locator('body')).toBeVisible();
  });

  test('平板布局正确', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/zh/');
    
    // 页面应正常渲染
    await expect(page.locator('body')).toBeVisible();
  });

  test('桌面布局正确', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/zh/');
    
    // 页面应正常渲染
    await expect(page.locator('body')).toBeVisible();
  });
});
