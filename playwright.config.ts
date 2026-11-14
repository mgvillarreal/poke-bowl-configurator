import { defineConfig, devices } from '@playwright/test'

const isCI = Boolean(process.env.CI)
const PORT = 4173

/**
 * Los tests corren contra el build de producción (vite preview), igual que lo vería un visitante.
 * Localmente usan el Chrome instalado; en CI, el Chromium que instala Playwright.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, channel: isCI ? undefined : 'chrome' },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: isCI ? undefined : 'chrome' },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
