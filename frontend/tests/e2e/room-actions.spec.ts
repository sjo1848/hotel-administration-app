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

test('check-in and check-out flow updates UI', async ({ page }) => {
  await loginAsAdmin(page);

  const availableCard = page.locator('.card-animate').filter({ hasText: 'AVAILABLE' }).first();
  await expect(availableCard).toBeVisible();

  await availableCard.getByRole('button', { name: 'Check-in' }).click();
  await page.getByLabel('Nombre huésped').fill('Playwright Guest');
  await page.getByRole('button', { name: 'Confirmar' }).click();

  await expect(page.getByText('Check-in registrado')).toBeVisible();

  const occupiedCard = page.locator('.card-animate').filter({ hasText: 'OCCUPIED' }).first();
  await expect(occupiedCard).toBeVisible();

  await occupiedCard.getByRole('button', { name: 'Check-out' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();

  await expect(page.getByText('Check-out registrado')).toBeVisible({ timeout: 10000 });
});
