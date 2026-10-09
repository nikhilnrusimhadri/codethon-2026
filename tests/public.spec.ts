import { test, expect } from '@playwright/test';

const publicPages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Rounds', path: '/rounds' },
  { name: 'Eligibility', path: '/eligibility' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Announcements', path: '/announcements' },
  { name: 'Jury', path: '/jury' },
  { name: 'Teams', path: '/teams' },
  { name: 'Results', path: '/results' },
  { name: 'Registration', path: '/register' },
];

for (const pageInfo of publicPages) {
  test(`${pageInfo.name} page loads successfully`, async ({ page }) => {
    const response = await page.goto(pageInfo.path, {
      waitUntil: 'domcontentloaded',
    });

    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    await expect(page.locator('body')).toBeVisible();
  });
}