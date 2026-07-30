import { expect, test } from '@playwright/test';

async function openHome(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /toca o presiona aquí para comenzar/i }).click();
  await expect(page.getByRole('heading', { name: 'TypingRoll' })).toBeVisible();
}

test.describe('Keyboard test en escritorio', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('aplica configuración, resalta teclas y las limpia al instante', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: 'Keyboard test' }).click();
    await expect(page.getByRole('heading', { name: 'Keyboard test' })).toBeVisible();

    await page.getByLabel('Fondo').selectOption('sakura');
    await page.getByLabel('Paleta').selectOption('lilac');
    await page.getByRole('button', { name: 'English ANSI' }).click();
    await page.getByRole('button', { name: '100%' }).click();
    await expect(page.locator('.keyboard-test-screen')).toHaveClass(/keyboard-theme-sakura/);
    await expect(page.getByLabel('Tecla Ñ')).toHaveCount(0);
    await expect(page.getByLabel('Tecla 0')).toHaveCount(2);

    await page.keyboard.press('a');
    const keyA = page.getByLabel('Tecla A').first();
    await expect(keyA).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Limpiar teclas usadas' }).click();
    await expect(keyA).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('Párrafo y matemáticas en móvil', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('bloquea la entrega de párrafo hasta que coincida de forma exacta', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: /jugar ahora/i }).click();
    await page.getByRole('button', { name: /párrafo infinito/i }).click();
    await page.getByRole('button', { name: 'Clásico' }).click();
    const submit = page.getByRole('button', { name: /confirmar con enter/i });
    await expect(submit).toBeDisabled();
    const reference = await page.locator('.paragraph-reference p').textContent();
    await page.getByLabel('Escribe el párrafo aquí').fill(`${reference} `);
    await expect(submit).toBeDisabled();
    await page.getByLabel('Escribe el párrafo aquí').fill(reference ?? '');
    await expect(submit).toBeEnabled();
    await page.getByLabel('Escribe el párrafo aquí').press('Enter');
    await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  });

  test('abre Autoayuda bíblica con referencia y música temática', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: /jugar ahora/i }).click();
    await page.getByRole('button', { name: /párrafo infinito/i }).click();
    await page.getByRole('button', { name: 'Autoayuda bíblica' }).click();
    await expect(page.getByText(/modo infinito · reflexión bíblica/i)).toBeVisible();
    await expect(page.getByText(/reflexión original vinculada a/i)).toBeVisible();
    await expect(page.getByText(/pista actual: órgano delicado/i)).toBeVisible();
  });

  test('recorre Matemáticas, Aritmética y abre una suma de fase 1', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: /jugar ahora/i }).click();
    await page.getByRole('button', { name: 'Matemáticas' }).click();
    await page.getByRole('button', { name: 'Aritmética' }).click();
    await page.getByRole('button', { name: 'Suma' }).click();
    await expect(page.getByText('Suma y confirma el resultado')).toBeVisible();
    await expect(page.getByText('Fase 1')).toBeVisible();
  });
});
