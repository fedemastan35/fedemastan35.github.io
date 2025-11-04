import { Page, Locator, expect } from '@playwright/test';

export class BookTrackerPage {
  readonly page: Page;
  
  // Header
  readonly header: Locator;
  readonly addBookButton: Locator;
  
  // Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly searchError: Locator;
  
  // Filters
  readonly filterStatus: Locator;
  readonly filterRating: Locator;
  readonly filterAuthor: Locator;
  readonly filterSearch: Locator;
  readonly clearFiltersButton: Locator;
  
  // Book List
  readonly bookList: Locator;
  readonly bookListEmpty: Locator;
  readonly bookCards: Locator;
  
  // Book Form
  readonly bookForm: Locator;
  readonly formTitle: Locator;
  readonly formAuthor: Locator;
  readonly formYear: Locator;
  readonly formIsbn: Locator;
  readonly formStatus: Locator;
  readonly formRating: Locator;
  readonly formNotes: Locator;
  readonly formSave: Locator;
  readonly formCancel: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header
    this.header = page.locator('.app-header');
    this.addBookButton = page.getByTestId('add-book-button');
    
    // Search
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByTestId('search-button');
    this.searchResults = page.getByTestId('search-results');
    this.searchError = page.getByTestId('search-error');
    
    // Filters
    this.filterStatus = page.getByTestId('filter-status');
    this.filterRating = page.getByTestId('filter-rating');
    this.filterAuthor = page.getByTestId('filter-author');
    this.filterSearch = page.getByTestId('filter-search');
    this.clearFiltersButton = page.getByTestId('clear-filters');
    
    // Book List
    this.bookList = page.getByTestId('book-list');
    this.bookListEmpty = page.getByTestId('book-list-empty');
    this.bookCards = page.getByTestId(/book-card-/);
    
    // Book Form
    this.bookForm = page.getByTestId('book-form');
    this.formTitle = page.getByTestId('form-title');
    this.formAuthor = page.getByTestId('form-author');
    this.formYear = page.getByTestId('form-year');
    this.formIsbn = page.getByTestId('form-isbn');
    this.formStatus = page.getByTestId('form-status');
    this.formNotes = page.getByTestId('form-notes');
    this.formSave = page.getByTestId('form-save');
    this.formCancel = page.getByTestId('form-cancel');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async searchForBook(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSearchResults() {
    await expect(this.searchResults).toBeVisible({ timeout: 10000 });
  }

  async addBookFromSearch(index: number = 0) {
    const addButton = this.page.getByTestId(/add-button-/).nth(index);
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();
  }

  async addBookManually(book: {
    title: string;
    author?: string;
    year?: number;
    isbn?: string;
    status?: 'want-to-read' | 'reading' | 'completed';
    rating?: number;
    notes?: string;
  }) {
    await this.addBookButton.click();
    await expect(this.bookForm).toBeVisible();
    
    await this.formTitle.fill(book.title);
    
    if (book.author) {
      await this.formAuthor.fill(book.author);
    }
    
    if (book.year) {
      await this.formYear.fill(book.year.toString());
    }
    
    if (book.isbn) {
      await this.formIsbn.fill(book.isbn);
    }
    
    if (book.status) {
      await this.formStatus.selectOption(book.status);
    }
    
    if (book.rating) {
      await this.page.getByTestId(`form-star-${book.rating}`).click();
    }
    
    if (book.notes) {
      await this.formNotes.fill(book.notes);
    }
    
    await this.formSave.click();
    await expect(this.bookForm).not.toBeVisible();
  }

  async editBook(bookId: string, updates: {
    title?: string;
    author?: string;
    year?: number;
    status?: 'want-to-read' | 'reading' | 'completed';
    rating?: number;
    notes?: string;
  }) {
    const editButton = this.page.getByTestId(`edit-btn-${bookId}`);
    await editButton.click();
    await expect(this.bookForm).toBeVisible();
    
    if (updates.title) {
      await this.formTitle.clear();
      await this.formTitle.fill(updates.title);
    }
    
    if (updates.author) {
      await this.formAuthor.clear();
      await this.formAuthor.fill(updates.author);
    }
    
    if (updates.year) {
      await this.formYear.clear();
      await this.formYear.fill(updates.year.toString());
    }
    
    if (updates.status) {
      await this.formStatus.selectOption(updates.status);
    }
    
    if (updates.rating) {
      await this.page.getByTestId(`form-star-${updates.rating}`).click();
    }
    
    if (updates.notes !== undefined) {
      await this.formNotes.clear();
      if (updates.notes) {
        await this.formNotes.fill(updates.notes);
      }
    }
    
    await this.formSave.click();
    await expect(this.bookForm).not.toBeVisible();
  }

  async deleteBook(bookId: string) {
    const deleteButton = this.page.getByTestId(`delete-btn-${bookId}`);
    
    // Set up dialog handler
    this.page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    
    await deleteButton.click();
    await expect(deleteButton).toHaveText('Confirm?');
    await deleteButton.click();
  }

  async changeBookStatus(bookId: string, status: 'want-to-read' | 'reading' | 'completed') {
    const statusSelect = this.page.getByTestId(`status-select-${bookId}`);
    await statusSelect.selectOption(status);
  }

  async rateBook(bookId: string, rating: number) {
    const starButton = this.page.getByTestId(`star-${rating}-${bookId}`);
    await starButton.click();
  }

  async filterByStatus(status: 'want-to-read' | 'reading' | 'completed') {
    await this.filterStatus.selectOption(status);
    await this.page.waitForTimeout(300); // Wait for filter to apply
  }

  async filterByRating(rating: number) {
    await this.filterRating.selectOption(rating.toString());
  }

  async filterByAuthor(author: string) {
    await this.filterAuthor.fill(author);
    await this.page.waitForTimeout(300); // Wait for filter to apply
  }

  async searchCollection(query: string) {
    await this.filterSearch.fill(query);
    await this.page.waitForTimeout(300); // Wait for filter to apply
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
  }

  async getBookCard(bookId: string) {
    return this.page.getByTestId(`book-card-${bookId}`);
  }

  async getBookIdByIndex(index: number = 0): Promise<string> {
    const bookCard = this.bookCards.nth(index);
    const testId = await bookCard.getAttribute('data-testid');
    if (!testId) {
      throw new Error(`Could not find book card at index ${index}`);
    }
    return testId.replace('book-card-', '');
  }

  async getBookIdByTitle(title: string): Promise<string> {
    const bookCard = this.page.locator('.book-card').filter({ hasText: title });
    const testId = await bookCard.getAttribute('data-testid');
    if (!testId) {
      throw new Error(`Could not find book with title: ${title}`);
    }
    return testId.replace('book-card-', '');
  }

  async expectBookVisible(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectBookNotVisible(title: string) {
    await expect(this.page.getByText(title)).not.toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.bookListEmpty).toBeVisible();
  }

  async expectBooksCount(count: number) {
    await expect(this.bookCards).toHaveCount(count);
  }
}

