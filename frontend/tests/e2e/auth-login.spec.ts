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

test('login as admin shows rooms panel', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible({ timeout: 20000 });
  await expect(page.locator('.card-animate').first()).toBeVisible({ timeout: 20000 });
});

test('invalid login shows error', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email').fill('bad@paloalto.com');
  await page.getByLabel('Password').fill('wrong');
  const loginResponse = page.waitForResponse((response) => {
    return response.url().includes('/api/v1/auth/login') && response.status() === 401;
  });
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await loginResponse;
  await expect(page.getByText(/Error de login|Invalid credentials/i)).toBeVisible();
});
