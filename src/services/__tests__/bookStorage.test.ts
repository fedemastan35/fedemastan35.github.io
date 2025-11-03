import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllBooks,
  saveBook,
  getBookById,
  deleteBook,
  filterBooks,
  updateBookStatus,
  updateBookRating,
} from '../bookStorage';
import type { TrackedBook } from '../../types/book';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('bookStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockBook: TrackedBook = {
    id: '1',
    olid: 'OL123W',
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: 2020,
    status: 'want-to-read',
    dateAdded: '2024-01-01T00:00:00.000Z',
  };

  describe('getAllBooks', () => {
    it('should return empty array when localStorage is empty', () => {
      expect(getAllBooks()).toEqual([]);
    });

    it('should return books from localStorage', () => {
      localStorage.setItem('book-tracker-collection', JSON.stringify([mockBook]));
      const books = getAllBooks();
      expect(books).toHaveLength(1);
      expect(books[0]).toEqual(mockBook);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('book-tracker-collection', 'invalid json');
      expect(getAllBooks()).toEqual([]);
    });
  });

  describe('saveBook', () => {
    it('should save a new book', () => {
      saveBook(mockBook);
      const books = getAllBooks();
      expect(books).toHaveLength(1);
      expect(books[0]).toEqual(mockBook);
    });

    it('should update an existing book', () => {
      saveBook(mockBook);
      const updatedBook = { ...mockBook, title: 'Updated Title' };
      saveBook(updatedBook);
      
      const books = getAllBooks();
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Updated Title');
    });

    it('should save multiple books', () => {
      const book1 = { ...mockBook, id: '1' };
      const book2 = { ...mockBook, id: '2', title: 'Book 2' };
      
      saveBook(book1);
      saveBook(book2);
      
      const books = getAllBooks();
      expect(books).toHaveLength(2);
    });
  });

  describe('getBookById', () => {
    it('should return book by id', () => {
      saveBook(mockBook);
      const book = getBookById('1');
      expect(book).toEqual(mockBook);
    });

    it('should return null for non-existent book', () => {
      expect(getBookById('999')).toBeNull();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', () => {
      saveBook(mockBook);
      const deleted = deleteBook('1');
      
      expect(deleted).toBe(true);
      expect(getAllBooks()).toHaveLength(0);
    });

    it('should return false if book does not exist', () => {
      expect(deleteBook('999')).toBe(false);
    });
  });

  describe('filterBooks', () => {
    const books: TrackedBook[] = [
      { ...mockBook, id: '1', status: 'want-to-read', author: 'Author A', rating: 5 },
      { ...mockBook, id: '2', status: 'reading', author: 'Author B', rating: 3 },
      { ...mockBook, id: '3', status: 'completed', author: 'Author A', rating: 4 },
    ];

    it('should filter by status', () => {
      const filtered = filterBooks(books, { status: 'reading' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('reading');
    });

    it('should filter by rating', () => {
      const filtered = filterBooks(books, { rating: 5 });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].rating).toBe(5);
    });

    it('should filter by author', () => {
      const filtered = filterBooks(books, { author: 'Author A' });
      expect(filtered).toHaveLength(2);
      expect(filtered.every(b => b.author === 'Author A')).toBe(true);
    });

    it('should filter by search query (title)', () => {
      const booksWithTitles = [
        { ...mockBook, id: '1', title: 'Book One' },
        { ...mockBook, id: '2', title: 'Book Two' },
      ];
      const filtered = filterBooks(booksWithTitles, { searchQuery: 'One' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Book One');
    });

    it('should filter by search query (author)', () => {
      const filtered = filterBooks(books, { searchQuery: 'Author B' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].author).toBe('Author B');
    });

    it('should combine multiple filters', () => {
      const filtered = filterBooks(books, {
        status: 'want-to-read',
        rating: 5,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should return all books when no filters', () => {
      const filtered = filterBooks(books, {});
      expect(filtered).toHaveLength(3);
    });
  });

  describe('updateBookStatus', () => {
    it('should update book status', () => {
      saveBook(mockBook);
      const updated = updateBookStatus('1', 'reading');
      
      expect(updated).toBe(true);
      const book = getBookById('1');
      expect(book?.status).toBe('reading');
    });

    it('should set dateStarted when status changes to reading', () => {
      saveBook(mockBook);
      updateBookStatus('1', 'reading');
      
      const book = getBookById('1');
      expect(book?.dateStarted).toBeDefined();
    });

    it('should set dateCompleted when status changes to completed', () => {
      saveBook(mockBook);
      updateBookStatus('1', 'completed');
      
      const book = getBookById('1');
      expect(book?.dateCompleted).toBeDefined();
    });

    it('should return false if book does not exist', () => {
      expect(updateBookStatus('999', 'reading')).toBe(false);
    });
  });

  describe('updateBookRating', () => {
    it('should update book rating', () => {
      saveBook(mockBook);
      const updated = updateBookRating('1', 5);
      
      expect(updated).toBe(true);
      const book = getBookById('1');
      expect(book?.rating).toBe(5);
    });

    it('should return false if book does not exist', () => {
      expect(updateBookRating('999', 5)).toBe(false);
    });
  });
});

