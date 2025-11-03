import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should match empty state screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('empty-state.png', {
      fullPage: true,
    });
  });

  test('should match book list with multiple books', async ({ page }) => {
    await page.goto('/');
    
    // Add multiple books
    for (let i = 1; i <= 3; i++) {
      await page.getByTestId('add-book-button').click();
      await page.getByTestId('form-title').fill(`Test Book ${i}`);
      await page.getByTestId('form-author').fill(`Author ${i}`);
      await page.getByTestId('form-year').fill(`${2020 + i}`);
      await page.getByTestId('form-save').click();
      
      // Wait a bit between additions
      await page.waitForTimeout(500);
    }
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('book-list.png', {
      fullPage: true,
    });
  });

  test('should match search results page', async ({ page }) => {
    await page.goto('/');
    
    // Perform a search
    await page.getByTestId('search-input').fill('1984');
    await page.getByTestId('search-button').click();
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('search-results.png', {
      fullPage: true,
    });
  });

  test('should match book form modal', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    
    await expect(page.getByTestId('book-form')).toBeVisible();
    
    // Fill some fields to show the form state
    await page.getByTestId('form-title').fill('Test Book Title');
    await page.getByTestId('form-author').fill('Test Author');
    
    await expect(page.getByTestId('book-form')).toHaveScreenshot('book-form.png');
  });

  test('should match book card component', async ({ page }) => {
    await page.goto('/');
    
    // Add a book with all fields
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Complete Book');
    await page.getByTestId('form-author').fill('Complete Author');
    await page.getByTestId('form-year').fill('2024');
    await page.getByTestId('form-status').selectOption('reading');
    await page.getByTestId('form-star-4').click();
    await page.getByTestId('form-notes').fill('This is a test note for visual testing.');
    await page.getByTestId('form-save').click();
    
    // Wait for card to appear
    await page.waitForSelector('[data-testid^="book-card-"]');
    
    const bookCard = page.getByTestId(/book-card-/).first();
    await expect(bookCard).toHaveScreenshot('book-card.png');
  });

  test('should match filtered view', async ({ page }) => {
    await page.goto('/');
    
    // Add books with different statuses
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Want to Read Book');
    await page.getByTestId('form-status').selectOption('want-to-read');
    await page.getByTestId('form-save').click();
    
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Reading Book');
    await page.getByTestId('form-status').selectOption('reading');
    await page.getByTestId('form-save').click();
    
    // Apply filter
    await page.getByTestId('filter-status').selectOption('reading');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('filtered-view.png', {
      fullPage: true,
    });
  });

  test('should match header and layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('.app-header');
    await expect(header).toHaveScreenshot('header.png');
  });
});

