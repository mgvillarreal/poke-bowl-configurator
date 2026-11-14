import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Auditoría automática con axe-core contra WCAG 2.0/2.1 nivel A y AA
 * (incluye contraste de color) en los estados principales de la página.
 */
async function expectNoViolations(page: Page) {
  // Espera a que terminen las animaciones de entrada (la opacidad intermedia falsea el contraste)
  await page.waitForTimeout(1200)
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const summary = results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    targets: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary?.split('\n').slice(1).join(' ')}`),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
}

test.describe('Accesibilidad (axe-core, WCAG 2.1 AA)', () => {
  test.use({ reducedMotion: 'reduce' })

  test('página inicial en español', async ({ page }) => {
    await page.goto('/')
    await expectNoViolations(page)
  })

  test('página inicial en inglés', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'English' }).click()
    await expectNoViolations(page)
  })

  test('bowl vacío', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Vaciar bowl' }).click()
    await expectNoViolations(page)
  })

  test('checkout: revisión del pedido', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Agregar al pedido' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expectNoViolations(page)
  })

  test('checkout: datos con errores de validación', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Agregar al pedido' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByText('A domicilio', { exact: true }).click()
    await dialog.getByText('Programar', { exact: true }).click()
    await page.getByRole('button', { name: /Confirmar pedido/ }).click()
    await expect(page.getByText('Escribe tu nombre.')).toBeVisible()
    await expectNoViolations(page)
  })

  test('checkout: confirmación', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Agregar al pedido' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    await page.getByLabel(/Nombre/).fill('Gaby')
    await page.getByLabel(/Teléfono/).fill('5512345678')
    await page.getByRole('button', { name: /Confirmar pedido/ }).click()
    await expect(page.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeVisible()
    await expectNoViolations(page)
  })
})
