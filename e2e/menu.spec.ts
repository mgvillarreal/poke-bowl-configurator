import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

/** Los filtros viven en el grupo "Preferencias" (las tarjetas también dicen "Vegano") */
const preference = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('group', { name: 'Preferencias' }).getByRole('button', { name })

const card = (page: import('@playwright/test').Page, name: string | RegExp) =>
  page.locator('#armar').getByRole('button', { name })

test.describe('Bowls de la casa', () => {
  test('muestra los 4 bowls con precio y etiquetas de dieta', async ({ page }) => {
    const section = page.locator('#bowls-de-la-casa')
    await expect(section.getByRole('listitem')).toHaveCount(4)

    const vegan = section.getByRole('listitem').filter({ hasText: 'Green Vegan' })
    await expect(vegan.getByText('$184')).toBeVisible()
    await expect(vegan.getByText('Vegano', { exact: true })).toBeVisible()
    await expect(vegan.getByText('Sin gluten', { exact: true })).toBeVisible()
  })

  test('"Personalizar" carga el bowl en el armador', async ({ page }) => {
    await page.getByRole('button', { name: 'Personalizar (Green Vegan)' }).click()

    await expect(page.getByText('Cargamos Green Vegan. ¡Ajústalo a tu gusto!')).toBeVisible()
    await expect(page.locator('#armar').getByText('Tofu crujiente · Aderezo de sésamo')).toBeVisible()
    await expect(page.getByTestId('bowl-total')).toHaveText('$184')
    await expect(card(page, /Mix de hojas/)).toHaveAttribute('aria-pressed', 'true')
  })

  test('"Agregar al pedido" lo manda directo al pedido con su nombre', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar al pedido (Spicy Tuna)' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('Spicy Tuna')).toBeVisible()
    await expect(dialog.getByRole('list', { name: 'Tu pedido' }).getByRole('listitem')).toHaveCount(1)
    await expect(dialog.getByText('$204').first()).toBeVisible()
  })
})

test.describe('Preferencias de dieta', () => {
  test('"Vegano" atenúa lo que no aplica y explica por qué', async ({ page }) => {
    const vegan = preference(page, 'Vegano')
    await vegan.click()
    await expect(vegan).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('tab', { name: /Proteína/ }).click()
    await expect(card(page, /Atún shoyu/)).toHaveAttribute('aria-disabled', 'true')
    await expect(card(page, /Atún shoyu/)).toContainText('No es vegano')
    await expect(card(page, /Tofu crujiente/)).not.toHaveAttribute('aria-disabled', 'true')
    await expect(card(page, /Tofu crujiente/)).toContainText('Vegano')
  })

  test('no deja agregar un ingrediente que no cumple', async ({ page }) => {
    await preference(page, 'Sin gluten').click()
    await page.getByRole('tab', { name: /Proteína/ }).click()
    // aria-disabled: Playwright no hace clic por defecto; una persona sí puede tocarla
    await card(page, /Pollo teriyaki/).click({ force: true })

    await expect(page.getByText('Pollo teriyaki: contiene gluten.')).toBeVisible()
    await expect(card(page, /Pollo teriyaki/)).toHaveAttribute('aria-pressed', 'false')
  })

  test('avisa si el bowl ya tiene ingredientes incompatibles y permite quitarlos', async ({ page }) => {
    // El bowl por defecto lleva salmón y spicy mayo (con huevo): no es vegano
    await preference(page, 'Vegano').click()
    await expect(page.getByText('2 ingredientes de tu bowl no cumplen tus preferencias.')).toBeVisible()

    await page.getByRole('button', { name: 'Quitarlos' }).click()
    await expect(page.getByText('Quitamos 2 ingredientes que no cumplían tus preferencias.')).toBeVisible()
    await expect(page.getByText(/no cumplen tus preferencias/)).toBeHidden()
    await page.getByRole('tab', { name: /Proteína/ }).click()
    await expect(card(page, /Salmón/)).toHaveAttribute('aria-pressed', 'false')
  })

  test('"Sorpréndeme" respeta las preferencias', async ({ page }) => {
    await preference(page, 'Vegano').click()
    await preference(page, 'Sin gluten').click()
    await page.getByRole('button', { name: /Sorpréndeme/ }).click()

    await expect(page.getByText(/no cumplen tus preferencias/)).toBeHidden()
    await page.getByRole('tab', { name: /Proteína/ }).click()
    // El tofu es la única proteína vegana
    await expect(card(page, /Tofu crujiente/)).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('Pedido con varios bowls', () => {
  test('arma dos bowls, cada uno con su nombre', async ({ page }) => {
    await page.getByLabel('¿Para quién es? (opcional)').fill('Gaby')
    await page.getByRole('button', { name: 'Agregar al pedido', exact: true }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('textbox', { name: '¿Para quién es Gaby?' })).toHaveValue('Gaby')
    await dialog.getByRole('button', { name: /Armar otro bowl/ }).click()
    await expect(dialog).toBeHidden()

    await page.getByRole('tab', { name: /Proteína/ }).click()
    await card(page, /Atún shoyu/).click()
    await page.getByLabel('¿Para quién es? (opcional)').fill('Alex')
    await page.getByRole('button', { name: 'Agregar al pedido', exact: true }).click()

    await expect(dialog.getByRole('list', { name: 'Tu pedido' }).getByRole('listitem')).toHaveCount(2)
    await expect(dialog.getByRole('textbox', { name: '¿Para quién es Alex?' })).toHaveValue('Alex')
    await expect(dialog.getByText('$398')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Ver tu pedido: 2 bowls' })).toBeVisible()
  })

  test('cambia la cantidad, renombra y quita bowls', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar al pedido', exact: true }).click()
    const dialog = page.getByRole('dialog')

    await dialog.getByRole('button', { name: 'Agregar uno: Bowl 1' }).click()
    await expect(dialog.getByText('$428').first()).toBeVisible()

    await dialog.getByRole('textbox', { name: '¿Para quién es Bowl 1?' }).fill('Sam')
    await expect(dialog.getByText('Sam × 2')).toBeVisible()

    await dialog.getByRole('button', { name: 'Quitar Sam del pedido' }).click()
    await expect(dialog.getByText('Tu pedido está vacío.')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: /Ver tu pedido/ })).toBeHidden()
  })

  test('el pedido se vacía al confirmarse', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar al pedido (Hawaiian Classic)' }).click()
    const dialog = page.getByRole('dialog')
    await expect(page.getByRole('button', { name: 'Ver tu pedido: 1 bowl' })).toBeAttached()

    await dialog.getByRole('button', { name: 'Continuar' }).click()
    await dialog.getByLabel(/Nombre/).fill('Gaby')
    await dialog.getByLabel(/Teléfono/).fill('5512345678')
    await dialog.getByRole('button', { name: /Confirmar pedido/ }).click()

    await expect(dialog.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeVisible()
    await expect(dialog.getByText('1 × Hawaiian Classic (Bowl 1)')).toBeVisible()
    await dialog.getByRole('button', { name: 'Listo' }).click()
    await expect(page.getByRole('button', { name: /Ver tu pedido/ })).toBeHidden()
  })
})
