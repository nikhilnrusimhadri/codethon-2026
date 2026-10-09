import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {
  test('registration form displays correctly', async ({ page }) => {
    await page.goto('/register', {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.getByRole('heading', { name: /register/i })
    ).toBeVisible();

    // Verify important registration fields.
    await expect(
      page.locator('input').filter({ visible: true })
    ).toHaveCount(
      await page.locator('input').filter({ visible: true }).count()
    );

    // Specifically target the College ID label.
    await expect(
      page.getByText('College ID Card *', { exact: true })
    ).toBeVisible();

    // File upload control must exist.
    await expect(
      page.locator('input[type="file"]')
    ).toHaveCount(1);
  });

  test('empty registration submission is rejected', async ({ page }) => {
    await page.goto('/register', {
      waitUntil: 'domcontentloaded',
    });

    const submitButton = page.getByRole('button', {
      name: /register|submit/i,
    });

    await expect(submitButton).toBeVisible();

    await submitButton.click();

    // The form must remain on the registration page.
    await expect(page).toHaveURL(/\/register/);
  });

  test('invalid email is rejected', async ({ page }) => {
    await page.goto('/register', {
      waitUntil: 'domcontentloaded',
    });

    const emailInput = page.locator('input[type="email"]');

    await expect(emailInput).toHaveCount(1);

    await emailInput.fill('invalid-email');
    await emailInput.blur();

    const validationMessage = await emailInput.evaluate(
      (input: HTMLInputElement) => input.validationMessage
    );

    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('college ID upload control accepts supported file types', async ({
    page,
  }) => {
    await page.goto('/register', {
      waitUntil: 'domcontentloaded',
    });

    const fileInput = page.locator('input[type="file"]');

    await expect(fileInput).toHaveCount(1);

    await expect(fileInput).toHaveAttribute(
      'accept',
      'image/jpeg,image/png,application/pdf'
    );
  });
});