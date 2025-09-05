import { test, expect } from '@playwright/test';

test.describe('Página de Clientes', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa a página inicial (login)
    await page.goto('http://localhost:5173/');

    // Preenche o nome no input
    await page.getByPlaceholder('Digite o seu nome:').fill('Felipe');

    // Clica no botão "Entrar"
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Espera que vá para a tela de clientes
    await expect(page.getByText(/clientes encontrados/i)).toBeVisible();
  });

  test('deve exibir a quantidade de clientes encontrados', async ({ page }) => {
    const countText = page.locator('p', { hasText: 'clientes encontrados' });
    console.log(countText);
    await expect(countText).toBeVisible();
  });

  test('deve abrir o modal ao clicar no botão "Criar cliente"', async ({
    page,
  }) => {
    const botaoCriar = page.getByRole('button', { name: /criar cliente/i });
    await botaoCriar.click();

    await expect(page.locator('.modal.show')).toBeVisible();
    await expect(page.getByPlaceholder('Digite o nome:')).toBeVisible();
    await expect(page.getByPlaceholder('Digite o salário:')).toBeVisible();
    await expect(
      page.getByPlaceholder('Digite o valor da empresa:')
    ).toBeVisible();
  });

  test('deve criar cliente e fechar modal', async ({ page }) => {
    await page.getByRole('button', { name: /criar cliente/i }).click();

    await page.getByPlaceholder('Digite o nome:').fill('João da Silva');
    await page.getByPlaceholder('Digite o salário:').fill('R$ 5.000,00');
    await page
      .getByPlaceholder('Digite o valor da empresa:')
      .fill('R$ 100.000,00');

    await page
      .getByRole('button', { name: /criar cliente/i })
      .last()
      .click();

    await expect(page.locator('.modal.show')).toHaveCount(0);
  });

  test('deve abrir modal de edição ao clicar no lápis', async ({ page }) => {
    const botoesEditar = page.locator('button.btn-update');
    if ((await botoesEditar.count()) > 0) {
      await botoesEditar.first().click();
      await expect(page.getByPlaceholder('Digite o nome:')).toBeVisible();
    }
  });

  test('deve exibir mensagem quando não houver clientes', async ({ page }) => {
    // Simule cenário sem clientes se possível
    const texto = page.locator('p.not-selected');
    if (await texto.isVisible()) {
      await expect(texto).toHaveText(/nenhum cliente cadastrado/i);
    }
  });
});
