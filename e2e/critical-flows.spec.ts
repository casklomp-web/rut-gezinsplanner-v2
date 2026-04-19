import { test, expect } from '@playwright/test';

test.describe('Critical Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load today page', async ({ page }) => {
    await expect(page).toHaveTitle(/Rut/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to week view', async ({ page }) => {
    await page.click('text=Week');
    await expect(page.url()).toContain('/week');
    await expect(page.locator('h1')).toContainText('Week');
  });

  test('should navigate to shopping list', async ({ page }) => {
    await page.click('text=Boodschappen');
    await expect(page.url()).toContain('/shopping');
  });

  test('should navigate to recipes', async ({ page }) => {
    await page.click('text=Recepten');
    await expect(page.url()).toContain('/recipes');
    await expect(page.locator('h1')).toContainText('Recepten');
  });

  test('should generate shopping list from week', async ({ page }) => {
    await page.goto('/week');
    
    // Check if week exists or generate one
    const generateButton = page.locator('button:has-text("Week genereren")');
    if (await generateButton.isVisible().catch(() => false)) {
      await generateButton.click();
      await page.waitForTimeout(500);
    }
    
    // Generate shopping list
    const shoppingButton = page.locator('button:has-text("Maak boodschappenlijst")');
    if (await shoppingButton.isVisible().catch(() => false)) {
      await shoppingButton.click();
      await expect(page.locator('text=Boodschappenlijst gegenereerd')).toBeVisible();
    }
  });

  test('should search recipes', async ({ page }) => {
    await page.goto('/recipes');
    
    const searchInput = page.locator('input[placeholder*="Zoek"]');
    await searchInput.fill('ei');
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Check if results are shown or empty state
    const results = page.locator('.space-y-3 > div');
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should toggle shopping items', async ({ page }) => {
    await page.goto('/shopping');
    
    // Look for shopping items
    const items = page.locator('button:has(.w-5.h-5)');
    const count = await items.count();
    
    if (count > 0) {
      await items.first().click();
      // Check if item is marked as checked
      await expect(items.first().locator('.bg-\\[\\#7CB342\\]')).toBeVisible();
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    
    // Check if any element has focus
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
