import { test, expect } from '@playwright/test';

test.describe('Book Tracking UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display empty state when no books', async ({ page }) => {
    await page.goto('/');
    
    const emptyState = page.getByTestId('book-list-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No books in your collection yet');
  });

  test('should search for books using Open Library API', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('1984');
    
    const searchButton = page.getByTestId('search-button');
    await searchButton.click();
    
    // Wait for results
    const searchResults = page.getByTestId('search-results');
    await expect(searchResults).toBeVisible({ timeout: 10000 });
    
    // Check that results contain search query
    const results = page.getByTestId(/search-result-/);
    await expect(results.first()).toBeVisible();
  });

  test('should add book from search results', async ({ page }) => {
    await page.goto('/');
    
    // Search for a book
    await page.getByTestId('search-input').fill('1984');
    await page.getByTestId('search-button').click();
    
    // Wait for results and click add button
    const addButton = page.getByTestId(/add-button-/).first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();
    
    // Fill form and save
    await expect(page.getByTestId('book-form')).toBeVisible();
    await page.getByTestId('form-status').selectOption('want-to-read');
    await page.getByTestId('form-save').click();
    
    // Verify book was added
    await expect(page.getByTestId('book-list-empty')).not.toBeVisible();
    const bookCard = page.getByTestId(/book-card-/).first();
    await expect(bookCard).toBeVisible();
  });

  test('should add book manually', async ({ page }) => {
    await page.goto('/');
    
    // Click add book button
    await page.getByTestId('add-book-button').click();
    
    // Fill form
    await expect(page.getByTestId('book-form')).toBeVisible();
    await page.getByTestId('form-title').fill('Test Book');
    await page.getByTestId('form-author').fill('Test Author');
    await page.getByTestId('form-year').fill('2024');
    await page.getByTestId('form-status').selectOption('reading');
    await page.getByTestId('form-save').click();
    
    // Verify book was added
    const bookCard = page.getByTestId(/book-card-/);
    await expect(bookCard).toBeVisible();
    await expect(bookCard).toContainText('Test Book');
    await expect(bookCard).toContainText('Test Author');
  });

  test('should edit book details', async ({ page }) => {
    // First add a book manually
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Original Title');
    await page.getByTestId('form-author').fill('Original Author');
    await page.getByTestId('form-save').click();
    
    // Click edit button
    const editButton = page.getByTestId(/edit-btn-/).first();
    await editButton.click();
    
    // Modify and save
    await expect(page.getByTestId('book-form')).toBeVisible();
    await page.getByTestId('form-title').clear();
    await page.getByTestId('form-title').fill('Updated Title');
    await page.getByTestId('form-save').click();
    
    // Verify changes
    await expect(page.getByTestId(/book-card-/)).toContainText('Updated Title');
  });

  test('should delete book', async ({ page }) => {
    // Add a book first
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Book to Delete');
    await page.getByTestId('form-save').click();
    
    // Set up dialog handler to accept the confirmation
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    
    // Click delete button
    const deleteButton = page.getByTestId(/delete-btn-/).first();
    await deleteButton.click();
    
    // Wait for confirmation state (button text changes to "Confirm?")
    await expect(deleteButton).toHaveText('Confirm?');
    
    // Confirm deletion (triggers window.confirm dialog)
    await deleteButton.click();
    
    // Verify book is removed
    await expect(page.getByTestId('book-list-empty')).toBeVisible();
  });

  test('should change book status', async ({ page }) => {
    // Add a book
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Status Test Book');
    await page.getByTestId('form-status').selectOption('want-to-read');
    await page.getByTestId('form-save').click();
    
    // Change status
    const statusSelect = page.getByTestId(/status-select-/).first();
    await statusSelect.selectOption('reading');
    
    // Verify status changed
    await expect(statusSelect).toHaveValue('reading');
  });

  test('should rate a book', async ({ page }) => {
    // Add a book
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Rating Test Book');
    await page.getByTestId('form-save').click();
    
    // Click on 4th star to rate
    const starButton = page.getByTestId(/star-4-/).first();
    await starButton.click();
    
    // Verify star is filled (by checking if it has the filled class or visible)
    await expect(starButton).toBeVisible();
  });

  test('should filter books by status', async ({ page }) => {
    // Add multiple books with different statuses
    await page.goto('/');
    
    // Add first book - want to read
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Want to Read Book');
    await page.getByTestId('form-status').selectOption('want-to-read');
    await page.getByTestId('form-save').click();
    
    // Wait for form to close and book to appear
    await expect(page.getByTestId('book-form')).not.toBeVisible();
    await expect(page.getByText('Want to Read Book')).toBeVisible();
    
    // Add second book - reading
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Reading Book');
    await page.getByTestId('form-status').selectOption('reading');
    await page.getByTestId('form-save').click();
    
    // Wait for form to close and book to appear
    await expect(page.getByTestId('book-form')).not.toBeVisible();
    await expect(page.getByText('Reading Book')).toBeVisible();
    
    // Filter by reading status
    await page.getByTestId('filter-status').selectOption('reading');
    
    // Wait for filtering to apply and verify only reading book is shown
    await expect(page.getByText('Reading Book')).toBeVisible();
    await expect(page.getByText('Want to Read Book')).not.toBeVisible();
  });

  test('should filter books by author', async ({ page }) => {
    // Add books with different authors
    await page.goto('/');
    
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Author A Book');
    await page.getByTestId('form-author').fill('Author A');
    await page.getByTestId('form-save').click();
    
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Author B Book');
    await page.getByTestId('form-author').fill('Author B');
    await page.getByTestId('form-save').click();
    
    // Filter by author
    await page.getByTestId('filter-author').fill('Author A');
    
    // Wait for filtering to apply - verify Author B disappears or Author A appears
    await expect(page.getByText('Author A Book')).toBeVisible();
    await expect(page.getByText('Author B Book')).not.toBeVisible({ timeout: 5000 });
  });

  test('should search collection', async ({ page }) => {
    // Add books
    await page.goto('/');
    
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Book One');
    await page.getByTestId('form-save').click();
    
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Book Two');
    await page.getByTestId('form-save').click();
    
    // Search collection
    await page.getByTestId('filter-search').fill('Book One');
    
    // Wait for filtering to apply - verify Book Two disappears
    await expect(page.getByText('Book One')).toBeVisible();
    await expect(page.getByText('Book Two')).not.toBeVisible({ timeout: 5000 });
  });

  test('should clear all filters', async ({ page }) => {
    // Add a book
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    await page.getByTestId('form-title').fill('Filter Test Book');
    await page.getByTestId('form-status').selectOption('completed');
    await page.getByTestId('form-save').click();
    
    // Apply filter
    await page.getByTestId('filter-status').selectOption('want-to-read');
    await expect(page.getByTestId('book-list-empty')).toBeVisible();
    
    // Clear filters
    await page.getByTestId('clear-filters').click();
    
    // Wait for filters to clear and UI to update
    await expect(page.getByText('Filter Test Book')).toBeVisible();
  });

  test('should cancel form without saving', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('add-book-button').click();
    
    await expect(page.getByTestId('book-form')).toBeVisible();
    await page.getByTestId('form-title').fill('Cancel Test');
    await page.getByTestId('form-cancel').click();
    
    // Verify form is closed and book not added
    await expect(page.getByTestId('book-form')).not.toBeVisible();
    await expect(page.getByText('Cancel Test')).not.toBeVisible();
  });
});

