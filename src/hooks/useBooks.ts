import { useState, useEffect, useCallback } from 'react';
import type { TrackedBook, BookFilters } from '../types/book';
import {
  getAllBooks,
  saveBook,
  deleteBook,
  filterBooks,
  updateBookStatus,
  updateBookRating,
} from '../services/bookStorage';

export function useBooks() {
  const [books, setBooks] = useState<TrackedBook[]>([]);
  const [filters, setFilters] = useState<BookFilters>({});

  // Load books from localStorage
  useEffect(() => {
    const loadedBooks = getAllBooks();
    setBooks(loadedBooks);
  }, []);

  // Filtered books based on current filters
  const filteredBooks = filterBooks(books, filters);

  // Add or update a book
  const addBook = useCallback((book: TrackedBook) => {
    saveBook(book);
    setBooks(getAllBooks());
  }, []);

  // Remove a book
  const removeBook = useCallback((id: string) => {
    if (deleteBook(id)) {
      setBooks(getAllBooks());
    }
  }, []);

  // Update book status
  const updateStatus = useCallback((id: string, status: TrackedBook['status']) => {
    if (updateBookStatus(id, status)) {
      setBooks(getAllBooks());
    }
  }, []);

  // Update book rating
  const updateRating = useCallback((id: string, rating: number) => {
    if (updateBookRating(id, rating)) {
      setBooks(getAllBooks());
    }
  }, []);

  // Update filters
  const setFilter = useCallback((newFilters: BookFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    books: filteredBooks,
    allBooks: books,
    filters,
    addBook,
    removeBook,
    updateStatus,
    updateRating,
    setFilter,
    clearFilters,
  };
}

