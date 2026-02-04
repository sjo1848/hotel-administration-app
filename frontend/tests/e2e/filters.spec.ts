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
  const roomsResponse = page.waitForResponse((response) => {
    return response.url().includes('/api/v1/rooms') && response.status() === 200;
  });
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await loginResponse;
  await roomsResponse;
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible({ timeout: 20000 });
}

test('filters rooms by status and search', async ({ page }) => {
  await loginAsAdmin(page);

  await page.getByRole('button', { name: 'Libres' }).click();
  await expect(page.locator('.card-animate').filter({ hasText: 'AVAILABLE' }).first()).toBeVisible();

  await page.getByPlaceholder('Buscar por número o tipo...').fill('Suite');
  await expect(page.locator('.card-animate').filter({ hasText: 'Suite' }).first()).toBeVisible();
});
