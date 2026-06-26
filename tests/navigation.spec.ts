import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navbar has correct links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /products/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
  })

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByText(/not found|404/i)).toBeVisible()
  })

  test('mobile menu works on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
  })
})
