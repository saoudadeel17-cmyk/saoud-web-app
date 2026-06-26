import { test, expect } from '@playwright/test'

test.describe('Shop', () => {
  test('homepage loads with hero and products', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 15000 })
  })

  test('products listing page loads', async ({ page }) => {
    await page.goto('/products')
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 15000 })
  })

  test('can add product to cart', async ({ page }) => {
    await page.goto('/products')
    await page.locator('[data-testid="add-to-cart"]').first().click()
    await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 5000 })
  })

  test('cart page shows added items', async ({ page }) => {
    await page.goto('/products')
    await page.locator('[data-testid="add-to-cart"]').first().click()
    await page.goto('/cart')
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('checkout redirects to login if not authenticated', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveURL(/login/)
  })
})
