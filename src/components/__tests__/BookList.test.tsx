import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookList } from '../BookList';
import type { TrackedBook } from '../../types/book';

describe('BookList', () => {
  const mockBook: TrackedBook = {
    id: '1',
    olid: 'OL123W',
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: 2020,
    status: 'want-to-read',
    dateAdded: '2024-01-01T00:00:00.000Z',
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
    onRatingChange: vi.fn(),
  };

  it('should display empty state when no books', () => {
    render(<BookList books={[]} {...mockHandlers} />);
    
    expect(screen.getByTestId('book-list-empty')).toBeInTheDocument();
    expect(screen.getByText(/No books in your collection yet/)).toBeInTheDocument();
  });

  it('should render books when provided', () => {
    render(<BookList books={[mockBook]} {...mockHandlers} />);
    
    expect(screen.getByTestId('book-list')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('should render multiple books', () => {
    const books = [
      mockBook,
      { ...mockBook, id: '2', title: 'Book Two' },
    ];
    
    render(<BookList books={books} {...mockHandlers} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
  });
});

