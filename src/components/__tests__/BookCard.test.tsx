import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from '../BookCard';
import type { TrackedBook } from '../../types/book';

describe('BookCard', () => {
  const mockBook: TrackedBook = {
    id: '1',
    olid: 'OL123W',
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: 2020,
    status: 'want-to-read',
    rating: 4,
    dateAdded: '2024-01-01T00:00:00.000Z',
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
    onRatingChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render book information', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('should call onStatusChange when status select changes', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    const statusSelect = screen.getByTestId('status-select-1');
    fireEvent.change(statusSelect, { target: { value: 'reading' } });
    
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith('1', 'reading');
  });

  it('should call onRatingChange when star is clicked', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    const star5 = screen.getByTestId('star-5-1');
    fireEvent.click(star5);
    
    expect(mockHandlers.onRatingChange).toHaveBeenCalledWith('1', 5);
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    const editButton = screen.getByTestId('edit-btn-1');
    fireEvent.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockBook);
  });

  it('should show confirmation on first delete click', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    const deleteButton = screen.getByTestId('delete-btn-1');
    expect(deleteButton).toHaveTextContent('Delete');
    
    fireEvent.click(deleteButton);
    expect(deleteButton).toHaveTextContent('Confirm?');
  });

  it('should call onDelete on second delete click', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    const deleteButton = screen.getByTestId('delete-btn-1');
    fireEvent.click(deleteButton); // First click - confirm
    fireEvent.click(deleteButton); // Second click - delete
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('should display notes if provided', () => {
    const bookWithNotes = { ...mockBook, notes: 'This is a test note' };
    render(<BookCard book={bookWithNotes} {...mockHandlers} />);
    
    expect(screen.getByText('This is a test note')).toBeInTheDocument();
  });

  it('should display placeholder when no cover image', () => {
    render(<BookCard book={mockBook} {...mockHandlers} />);
    
    const placeholder = screen.getByText('📚');
    expect(placeholder).toBeInTheDocument();
  });

  it('should display cover image when provided', () => {
    const bookWithCover = { ...mockBook, coverUrl: 'https://example.com/cover.jpg' };
    render(<BookCard book={bookWithCover} {...mockHandlers} />);
    
    const img = screen.getByAltText('Test Book');
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });
});

