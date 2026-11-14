import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('empieza en español con la bandera de Venezuela activa', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page).toHaveTitle('Nami Poke Bar · Arma tu bowl')
  await expect(page.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Arma')
})

test('cambia todo a inglés con la bandera de Estados Unidos', async ({ page }) => {
  await page.getByRole('button', { name: 'English' }).click()

  await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Nami Poke Bar · Build your bowl')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ride')
  await expect(page.getByRole('heading', { name: 'Build your bowl' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add to order', exact: true })).toBeVisible()
  await expect(page.locator('#armar').getByText('Salmon · Spicy mayo')).toBeVisible()
})

test('los precios usan "$" en ambos idiomas', async ({ page }) => {
  await expect(page.getByTestId('bowl-total')).toHaveText('$214')
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByTestId('bowl-total')).toHaveText('$214')
  await expect(page.getByText(/MX\$/)).toHaveCount(0)
})

test('los avisos se traducen', async ({ page }) => {
  await page.getByRole('button', { name: 'English' }).click()
  await page.getByRole('tab', { name: /Mix-ins/ }).click()
  await page.locator('#armar').getByRole('button', { name: /Cucumber/ }).click()
  await expect(page.getByText('A Regular bowl takes up to 4 mix-ins. Go Large for more!')).toBeVisible()
})

test('recuerda el idioma al volver a la página', async ({ page }) => {
  await page.getByRole('button', { name: 'English' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
})
