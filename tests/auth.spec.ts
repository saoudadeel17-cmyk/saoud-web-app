import { test, expect } from '@playwright/test'

test.describe('Auth', () => {
  test('signup page loads', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    await expect(page.getByPlaceholder(/your email/i)).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })

  test('login shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder(/your email/i).fill('wrong@email.com')
    await page.getByPlaceholder(/your password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /^login$/i }).click()
    await expect(page.getByText(/incorrect|invalid|wrong/i)).toBeVisible({ timeout: 8000 })
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('admin route redirects to login for guests', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/login/)
  })
})
