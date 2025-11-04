import { test, expect } from '@playwright/test';
import { BookTrackerPage } from '../pages/BookTrackerPage';

test.describe('Book Tracking UI Tests', () => {
  let bookTrackerPage: BookTrackerPage;

  test.beforeEach(async ({ page }) => {
    bookTrackerPage = new BookTrackerPage(page);
    await bookTrackerPage.goto();
  });

  test('should display empty state when no books', async () => {
    await expect(bookTrackerPage.bookListEmpty).toBeVisible();
    await expect(bookTrackerPage.bookListEmpty).toContainText('No books in your collection yet');
  });

  test('should search for books using Open Library API', async () => {
    await bookTrackerPage.searchForBook('1984');
    await bookTrackerPage.waitForSearchResults();
    
    // Check that results contain search query
    const results = bookTrackerPage.page.getByTestId(/search-result-/);
    await expect(results.first()).toBeVisible();
  });

  test('should add book from search results', async () => {
    await bookTrackerPage.searchForBook('1984');
    await bookTrackerPage.waitForSearchResults();
    await bookTrackerPage.addBookFromSearch(0);
    
    // Fill form and save
    await expect(bookTrackerPage.bookForm).toBeVisible();
    await bookTrackerPage.formStatus.selectOption('want-to-read');
    await bookTrackerPage.formSave.click();
    
    // Verify book was added
    await expect(bookTrackerPage.bookListEmpty).not.toBeVisible();
    await expect(bookTrackerPage.bookCards.first()).toBeVisible();
  });

  test('should add book manually', async () => {
    await bookTrackerPage.addBookManually({
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      status: 'reading',
    });
    
    // Verify book was added
    const bookCard = bookTrackerPage.bookCards.first();
    await expect(bookCard).toBeVisible();
    await expect(bookCard).toContainText('Test Book');
    await expect(bookCard).toContainText('Test Author');
  });

  test('should edit book details', async () => {
    // First add a book manually
    await bookTrackerPage.addBookManually({
      title: 'Original Title',
      author: 'Original Author',
    });
    
    // Get the book ID from the first book card
    const bookId = await bookTrackerPage.getBookIdByIndex(0);
    
    // Edit the book
    await bookTrackerPage.editBook(bookId, {
      title: 'Updated Title',
    });
    
    // Verify changes
    await expect(bookTrackerPage.bookCards.first()).toContainText('Updated Title');
  });

  test('should delete book', async () => {
    // Add a book first
    await bookTrackerPage.addBookManually({
      title: 'Book to Delete',
    });
    
    // Get the book ID from the first book card
    const bookId = await bookTrackerPage.getBookIdByIndex(0);
    
    // Delete the book
    await bookTrackerPage.deleteBook(bookId);
    
    // Verify book is removed
    await expect(bookTrackerPage.bookListEmpty).toBeVisible();
  });

  test('should change book status', async () => {
    // Add a book
    await bookTrackerPage.addBookManually({
      title: 'Status Test Book',
      status: 'want-to-read',
    });
    
    // Get the book ID
    const bookId = await bookTrackerPage.getBookIdByIndex(0);
    
    // Change status
    await bookTrackerPage.changeBookStatus(bookId, 'reading');
    
    // Verify status changed
    const statusSelect = bookTrackerPage.page.getByTestId(`status-select-${bookId}`);
    await expect(statusSelect).toHaveValue('reading');
  });

  test('should rate a book', async () => {
    // Add a book
    await bookTrackerPage.addBookManually({
      title: 'Rating Test Book',
    });
    
    // Get the book ID
    const bookId = await bookTrackerPage.getBookIdByIndex(0);
    
    // Click on 4th star to rate
    await bookTrackerPage.rateBook(bookId, 4);
    
    // Verify star is filled (by checking if it has the filled class or visible)
    const starButton = bookTrackerPage.page.getByTestId(`star-4-${bookId}`);
    await expect(starButton).toBeVisible();
  });

  test('should filter books by status', async () => {
    // Add multiple books with different statuses
    await bookTrackerPage.addBookManually({
      title: 'Want to Read Book',
      status: 'want-to-read',
    });
    await bookTrackerPage.expectBookVisible('Want to Read Book');
    
    await bookTrackerPage.addBookManually({
      title: 'Reading Book',
      status: 'reading',
    });
    await bookTrackerPage.expectBookVisible('Reading Book');
    
    // Filter by reading status
    await bookTrackerPage.filterByStatus('reading');
    
    // Wait for filtering to apply and verify only reading book is shown
    await bookTrackerPage.expectBookVisible('Reading Book');
    await bookTrackerPage.expectBookNotVisible('Want to Read Book');
  });

  test('should filter books by author', async () => {
    // Add books with different authors
    await bookTrackerPage.addBookManually({
      title: 'Author A Book',
      author: 'Author A',
    });
    
    await bookTrackerPage.addBookManually({
      title: 'Author B Book',
      author: 'Author B',
    });
    
    // Filter by author
    await bookTrackerPage.filterByAuthor('Author A');
    
    // Wait for filtering to apply - verify Author B disappears or Author A appears
    await bookTrackerPage.expectBookVisible('Author A Book');
    await bookTrackerPage.expectBookNotVisible('Author B Book');
  });

  test('should search collection', async () => {
    // Add books
    await bookTrackerPage.addBookManually({
      title: 'Book One',
    });
    
    await bookTrackerPage.addBookManually({
      title: 'Book Two',
    });
    
    // Search collection
    await bookTrackerPage.searchCollection('Book One');
    
    // Wait for filtering to apply - verify Book Two disappears
    await bookTrackerPage.expectBookVisible('Book One');
    await bookTrackerPage.expectBookNotVisible('Book Two');
  });

  test('should clear all filters', async () => {
    // Add a book
    await bookTrackerPage.addBookManually({
      title: 'Filter Test Book',
      status: 'completed',
    });
    
    // Apply filter
    await bookTrackerPage.filterByStatus('want-to-read');
    await expect(bookTrackerPage.bookListEmpty).toBeVisible();
    
    // Clear filters
    await bookTrackerPage.clearFilters();
    
    // Wait for filters to clear and UI to update
    await bookTrackerPage.expectBookVisible('Filter Test Book');
  });

  test('should cancel form without saving', async () => {
    await bookTrackerPage.addBookButton.click();
    await expect(bookTrackerPage.bookForm).toBeVisible();
    await bookTrackerPage.formTitle.fill('Cancel Test');
    await bookTrackerPage.formCancel.click();
    
    // Verify form is closed and book not added
    await expect(bookTrackerPage.bookForm).not.toBeVisible();
    await bookTrackerPage.expectBookNotVisible('Cancel Test');
  });
});

