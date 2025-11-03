import type { TrackedBook, ReadingStatus, BookFilters } from '../types/book';

const STORAGE_KEY = 'book-tracker-collection';

/**
 * Get all tracked books from localStorage
 */
export function getAllBooks(): TrackedBook[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as TrackedBook[];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save a book to the collection
 */
export function saveBook(book: TrackedBook): void {
  const books = getAllBooks();
  const existingIndex = books.findIndex(b => b.id === book.id);
  
  if (existingIndex >= 0) {
    books[existingIndex] = book;
  } else {
    books.push(book);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

/**
 * Get a book by ID
 */
export function getBookById(id: string): TrackedBook | null {
  const books = getAllBooks();
  return books.find(b => b.id === id) || null;
}

/**
 * Delete a book from the collection
 */
export function deleteBook(id: string): boolean {
  const books = getAllBooks();
  const filtered = books.filter(b => b.id !== id);
  
  if (filtered.length < books.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  
  return false;
}

/**
 * Filter books based on criteria
 */
export function filterBooks(books: TrackedBook[], filters: BookFilters): TrackedBook[] {
  return books.filter(book => {
    if (filters.status && book.status !== filters.status) {
      return false;
    }
    
    if (filters.rating && book.rating !== filters.rating) {
      return false;
    }
    
    if (filters.author) {
      const bookAuthor = book.author?.toLowerCase() || '';
      const filterAuthor = filters.author.toLowerCase();
      if (!bookAuthor.includes(filterAuthor)) {
        return false;
      }
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = book.title.toLowerCase().includes(query);
      const matchesAuthor = book.author?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesAuthor) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Update book status
 */
export function updateBookStatus(id: string, status: ReadingStatus): boolean {
  const book = getBookById(id);
  if (!book) return false;
  
  book.status = status;
  const now = new Date().toISOString();
  
  if (status === 'reading' && !book.dateStarted) {
    book.dateStarted = now;
  } else if (status === 'completed' && !book.dateCompleted) {
    book.dateCompleted = now;
  }
  
  saveBook(book);
  return true;
}

/**
 * Update book rating
 */
export function updateBookRating(id: string, rating: number): boolean {
  const book = getBookById(id);
  if (!book) return false;
  
  book.rating = rating;
  saveBook(book);
  return true;
}

