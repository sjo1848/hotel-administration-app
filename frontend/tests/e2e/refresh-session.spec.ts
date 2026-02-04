import { test, expect } from '@playwright/test';

const adminEmail = 'admin@paloalto.com';
const adminPassword = 'admin_password_123';

async function loginAsAdmin(page) {
  await page.goto('/');
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  const loginResponse = page.waitForResponse((response) => {
    return response.url().includes('/api/v1/auth/login') && response.status() === 201;
  });
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await loginResponse;
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible({ timeout: 20000 });
}

test('session persists via refresh cookie after reload', async ({ page }) => {
  await loginAsAdmin(page);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible({ timeout: 20000 });
});
