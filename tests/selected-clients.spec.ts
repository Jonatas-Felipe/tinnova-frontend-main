import { test, expect } from '@playwright/test';

test.describe('Página de Clientes Selecionados', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa a página inicial e simula o login
    await page.goto('http://localhost:5173/');
    await page.getByPlaceholder('Digite o seu nome:').fill('Felipe');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.locator('.loading')).toBeVisible();
    await expect(page.locator('.loading')).toBeHidden();

    // Aguarda redirecionamento para a lista de clientes
    await expect(page).toHaveURL(/clientes/);

    // Seleciona dois clientes na tela principal
    const addButtons = await page.locator('button.btn-select').all();

    await addButtons[0].click();
    await addButtons[1].click();

    // Vai para a tela de selecionados
    await page.goto('http://localhost:5173/clientes-selecionados');
  });

  test('deve exibir os clientes selecionados corretamente', async ({
    page,
  }) => {
    await expect(page.getByText('Clientes selecionados:')).toBeVisible();

    const cards = page.locator('div.ClientBox');
    await expect(cards).toHaveCount(2);

    // Verifica se aparece nome e valores
    await expect(cards.nth(0)).toContainText('Salário:');
    await expect(cards.nth(0)).toContainText('Empresa:');
  });

  test('deve desselecionar um cliente individualmente', async ({ page }) => {
    const minusButtons = page.locator('button.btn-unselect');
    await minusButtons.first().click();

    await page.getByRole('button', { name: 'Sim' }).click();
    await expect(page.locator('div.ClientBox')).toHaveCount(1);
  });

  test('deve limpar todos os clientes selecionados', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Limpar clientes selecionados' })
      .click();
    await page.getByRole('button', { name: 'Sim' }).click();

    await expect(page.locator('div.ClientBox')).toHaveCount(0);
    await expect(
      page.getByText('Nenhum cliente selecionado ainda')
    ).toBeVisible();
  });
});
