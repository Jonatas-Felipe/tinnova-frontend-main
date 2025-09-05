import { test, expect } from '@playwright/test';

test.describe('Página de Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('deve mostrar erro se tentar logar sem preencher o nome', async ({
    page,
  }) => {
    await page.click('button[type="submit"]');
    const error = await page.locator('.input ~ span');
    await expect(error).toHaveText('O seu nome é obrigatório');
  });

  test('deve logar corretamente com nome preenchido', async ({ page }) => {
    const nome = 'Jonatas';
    await page.fill('input[name="name"]', nome);
    await page.click('button[type="submit"]');
    await expect(page).not.toHaveURL('http://localhost:5173');
  });

  test('deve conter o texto de boas vindas', async ({ page }) => {
    await expect(page.getByText('Olá, seja bem-vindo!')).toBeVisible();
  });

  test('deve conter um input para preencher o nome', async ({ page }) => {
    const input = page.locator('input[name="name"]');
    await expect(input).toHaveCount(1);
  });
});
