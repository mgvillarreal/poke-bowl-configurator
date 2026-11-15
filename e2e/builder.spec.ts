import { expect, test } from '@playwright/test'

/**
 * Armador de bowls. Bowl por defecto: Regular ($169) + arroz de sushi + salmón (+$30)
 * + palta (+$15), mango, vainas de soja, cebolla + spicy mayo + sésamo y cebollín = $214.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const card = (page: import('@playwright/test').Page, name: string | RegExp) =>
  page.locator('#armar').getByRole('button', { name })

test('muestra el bowl por defecto con su precio', async ({ page }) => {
  await expect(page.getByTestId('bowl-total')).toHaveText('$214')
  await expect(page.locator('#armar').getByText('Salmón · Spicy mayo')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Base/ })).toHaveAttribute('aria-selected', 'true')
})

test('elegir otra proteína reemplaza la anterior en Regular', async ({ page }) => {
  await page.getByRole('tab', { name: /Proteína/ }).click()
  await card(page, /Atún shoyu/).click()

  await expect(card(page, /Atún shoyu/)).toHaveAttribute('aria-pressed', 'true')
  await expect(card(page, /Salmón/)).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByTestId('bowl-total')).toHaveText('$184')
  await expect(page.locator('#armar').getByText('Atún shoyu · Spicy mayo')).toBeVisible()
})

test('al llegar al límite avisa y sugiere pasar a Grande', async ({ page }) => {
  await page.getByRole('tab', { name: /Complementos/ }).click()
  await card(page, /Pepino/).click()

  await expect(page.getByText('El Regular lleva hasta 4 complementos. ¡Cámbiate a Grande para más!')).toBeVisible()
  await expect(card(page, /Pepino/)).toHaveAttribute('aria-pressed', 'false')
})

test('Grande permite más ingredientes y volver a Regular recorta el bowl', async ({ page }) => {
  await page.getByRole('radio', { name: /Grande/ }).click()
  await page.getByRole('tab', { name: /Complementos/ }).click()
  await card(page, /Pepino/).click()

  await expect(card(page, /Pepino/)).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('tab', { name: /Complementos/ })).toContainText('5/6')
  await expect(page.getByTestId('bowl-total')).toHaveText('$264')

  await page.getByRole('radio', { name: /Regular/ }).click()
  await expect(page.getByText('Ajustamos tu bowl al tamaño Regular.')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Complementos/ })).toContainText('4/4')
})

test('quitar un ingrediente lo deselecciona; la base solo se cambia', async ({ page }) => {
  await page.getByRole('tab', { name: /Toppings/ }).click()
  await card(page, /Cebollín/).click()
  await expect(card(page, /Cebollín/)).toHaveAttribute('aria-pressed', 'false')

  await page.getByRole('tab', { name: /Base/ }).click()
  await card(page, /Arroz de sushi/).click()
  await expect(card(page, /Arroz de sushi/)).toHaveAttribute('aria-pressed', 'true')
  await card(page, /Quinoa/).click()
  await expect(card(page, /Quinoa/)).toHaveAttribute('aria-pressed', 'true')
  await expect(card(page, /Arroz de sushi/)).toHaveAttribute('aria-pressed', 'false')
})

test('"Vaciar bowl" deja el bowl vacío y solo aparece si hay ingredientes', async ({ page }) => {
  const clear = page.getByRole('button', { name: 'Vaciar bowl' })
  await clear.click()

  await expect(clear).toBeHidden()
  await expect(page.locator('#armar').getByText('Tu bowl está vacío')).toBeVisible()
  await expect(page.getByText('Empieza eligiendo tu base')).toBeVisible()
  // Sin aviso: el bowl vacío ya lo comunica
  await expect(page.locator('[aria-live="polite"] p')).toHaveCount(0)

  await card(page, /Arroz integral/).click()
  await expect(clear).toBeVisible()
})

test('"Agregar al pedido" lleva al paso que falta', async ({ page }) => {
  await page.getByRole('button', { name: 'Vaciar bowl' }).click()
  await page.getByRole('button', { name: 'Agregar al pedido', exact: true }).click()
  await expect(page.getByText('Primero elige una base para tu bowl.')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Base/ })).toHaveAttribute('aria-selected', 'true')

  await card(page, /Arroz integral/).click()
  await page.getByRole('button', { name: 'Agregar al pedido', exact: true }).click()
  await expect(page.getByText('Elige al menos una proteína para tu bowl (¡el tofu cuenta!).')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Proteína/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('"Sorpréndeme" arma un bowl válido', async ({ page }) => {
  await page.getByRole('button', { name: /Sorpréndeme/ }).click()

  await expect(page.getByText('¡Bowl sorpresa! Ajústalo a tu gusto.')).toBeVisible()
  await expect(page.getByRole('tab', { name: /Base/ })).toContainText('1/1')
  await expect(page.getByRole('tab', { name: /Proteína/ })).toContainText('1/1')
  await expect(page.getByRole('tab', { name: /Complementos/ })).toContainText('4/4')
})
