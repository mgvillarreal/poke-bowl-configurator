import { expect, test, type Page } from '@playwright/test'

/** Abre el checkout con el bowl por defecto ($214) */
async function openCheckout(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Agregar al pedido' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  return dialog
}

test('pedido completo para recoger en tienda', async ({ page }) => {
  const dialog = await openCheckout(page)
  await expect(dialog.getByRole('heading', { name: 'Revisa tu bowl' })).toBeVisible()

  await dialog.getByRole('button', { name: 'Agregar uno' }).click()
  await expect(dialog.getByText('Subtotal')).toBeVisible()
  await expect(dialog.locator('dl').getByText('$428')).toBeVisible()

  await dialog.getByRole('button', { name: 'Continuar' }).click()
  await dialog.getByLabel(/Nombre/).fill('Gaby')
  await dialog.getByLabel(/Teléfono/).fill('55 1234 5678')
  await dialog.getByRole('button', { name: 'Confirmar pedido · $428' }).click()

  await expect(dialog.getByText('Enviando tu pedido a la cocina…')).toBeVisible()
  await expect(dialog.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeVisible()
  await expect(dialog.getByText(/NAMI-\d{4}/)).toBeVisible()
  await expect(dialog.getByText('Tu bowl estará listo en unos 15 min en Nami.')).toBeVisible()

  await dialog.getByRole('button', { name: 'Listo' }).click()
  await expect(dialog).toBeHidden()
})

test('valida los campos obligatorios y limpia el error al corregir', async ({ page }) => {
  const dialog = await openCheckout(page)
  await dialog.getByRole('button', { name: 'Continuar' }).click()
  await dialog.getByRole('button', { name: /Confirmar pedido/ }).click()

  const name = dialog.getByLabel(/Nombre/)
  await expect(dialog.getByText('Escribe tu nombre.')).toBeVisible()
  await expect(dialog.getByText('Escribe un teléfono de 10 dígitos.')).toBeVisible()
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(name).toHaveAttribute('aria-required', 'true')
  await expect(name).toBeFocused()

  await name.fill('Gaby')
  await expect(dialog.getByText('Escribe tu nombre.')).toBeHidden()
  await expect(name).toHaveAttribute('aria-invalid', 'false')

  await dialog.getByLabel(/Teléfono/).fill('12345')
  await dialog.getByRole('button', { name: /Confirmar pedido/ }).click()
  await expect(dialog.getByText('Escribe un teléfono de 10 dígitos.')).toBeVisible()
})

test('a domicilio pide dirección y suma el envío', async ({ page }) => {
  const dialog = await openCheckout(page)
  await dialog.getByRole('button', { name: 'Continuar' }).click()

  await expect(dialog.getByLabel(/Dirección de entrega/)).toBeHidden()
  await dialog.getByText('A domicilio', { exact: true }).click()
  await expect(dialog.getByLabel(/Dirección de entrega/)).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Confirmar pedido · $249' })).toBeVisible()

  await dialog.getByLabel(/Nombre/).fill('Gaby')
  await dialog.getByLabel(/Teléfono/).fill('5512345678')
  await dialog.getByRole('button', { name: /Confirmar pedido/ }).click()
  await expect(dialog.getByText('Escribe la dirección de entrega.')).toBeVisible()

  await dialog.getByLabel(/Dirección de entrega/).fill('Av. Ámsterdam 123')
  await dialog.getByRole('button', { name: /Confirmar pedido/ }).click()
  await expect(dialog.getByText('Tu bowl llegará en unos 35 min.')).toBeVisible()
})

test('programar muestra los horarios con el badge "Hoy"', async ({ page }) => {
  const dialog = await openCheckout(page)
  await dialog.getByRole('button', { name: 'Continuar' }).click()

  await expect(dialog.getByText('Hoy', { exact: true })).toBeHidden()
  await dialog.getByText('Programar', { exact: true }).click()
  const time = dialog.getByRole('combobox', { name: 'Hora' })
  await expect(time).toBeVisible()
  await expect(time.locator('option')).toHaveCount(6)
  await expect(dialog.getByText('Hoy', { exact: true })).toBeVisible()
})

test('teclado: el foco queda dentro del modal y Esc lo cierra', async ({ page }) => {
  const dialog = await openCheckout(page)
  await expect(dialog).toBeFocused()
  // El resto de la página queda inerte mientras el modal está abierto
  await expect(page.locator('[inert]')).toHaveCount(1)

  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Agregar al pedido' })).toBeFocused()
  await expect(page.locator('[inert]')).toHaveCount(0)
})

test('"Armar otro bowl" cierra el checkout y vacía el bowl', async ({ page }) => {
  const dialog = await openCheckout(page)
  await dialog.getByRole('button', { name: 'Continuar' }).click()
  await dialog.getByLabel(/Nombre/).fill('Gaby')
  await dialog.getByLabel(/Teléfono/).fill('5512345678')
  await dialog.getByRole('button', { name: /Confirmar pedido/ }).click()
  await dialog.getByRole('button', { name: 'Armar otro bowl' }).click()

  await expect(dialog).toBeHidden()
  await expect(page.locator('#armar').getByText('Tu bowl está vacío')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Vaciar bowl' })).toBeHidden()
})
