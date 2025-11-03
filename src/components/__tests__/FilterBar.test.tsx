import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';

describe('FilterBar', () => {
  const mockHandlers = {
    onStatusChange: vi.fn(),
    onRatingChange: vi.fn(),
    onAuthorChange: vi.fn(),
    onSearchChange: vi.fn(),
    onClearFilters: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all filter controls', () => {
    render(<FilterBar {...mockHandlers} />);
    
    expect(screen.getByTestId('filter-status')).toBeInTheDocument();
    expect(screen.getByTestId('filter-rating')).toBeInTheDocument();
    expect(screen.getByTestId('filter-author')).toBeInTheDocument();
    expect(screen.getByTestId('filter-search')).toBeInTheDocument();
  });

  it('should call onStatusChange when status filter changes', () => {
    render(<FilterBar {...mockHandlers} />);
    
    const statusFilter = screen.getByTestId('filter-status');
    fireEvent.change(statusFilter, { target: { value: 'reading' } });
    
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith('reading');
  });

  it('should call onRatingChange when rating filter changes', () => {
    render(<FilterBar {...mockHandlers} />);
    
    const ratingFilter = screen.getByTestId('filter-rating');
    fireEvent.change(ratingFilter, { target: { value: '5' } });
    
    expect(mockHandlers.onRatingChange).toHaveBeenCalledWith(5);
  });

  it('should call onAuthorChange when author filter changes', () => {
    render(<FilterBar {...mockHandlers} />);
    
    const authorFilter = screen.getByTestId('filter-author');
    fireEvent.change(authorFilter, { target: { value: 'Test Author' } });
    
    expect(mockHandlers.onAuthorChange).toHaveBeenCalledWith('Test Author');
  });

  it('should call onSearchChange when search query changes', () => {
    render(<FilterBar {...mockHandlers} />);
    
    const searchFilter = screen.getByTestId('filter-search');
    fireEvent.change(searchFilter, { target: { value: 'test query' } });
    
    expect(mockHandlers.onSearchChange).toHaveBeenCalledWith('test query');
  });

  it('should show clear filters button when filters are active', () => {
    render(
      <FilterBar
        statusFilter="reading"
        ratingFilter={5}
        {...mockHandlers}
      />
    );
    
    expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
  });

  it('should not show clear filters button when no filters are active', () => {
    render(<FilterBar {...mockHandlers} />);
    
    expect(screen.queryByTestId('clear-filters')).not.toBeInTheDocument();
  });

  it('should call onClearFilters when clear button is clicked', () => {
    render(
      <FilterBar
        statusFilter="reading"
        {...mockHandlers}
      />
    );
    
    const clearButton = screen.getByTestId('clear-filters');
    fireEvent.click(clearButton);
    
    expect(mockHandlers.onClearFilters).toHaveBeenCalled();
  });

  it('should display current filter values', () => {
    render(
      <FilterBar
        statusFilter="completed"
        ratingFilter={4}
        authorFilter="Test Author"
        searchQuery="test"
        {...mockHandlers}
      />
    );
    
    expect(screen.getByTestId('filter-status')).toHaveValue('completed');
    expect(screen.getByTestId('filter-rating')).toHaveValue('4');
    expect(screen.getByTestId('filter-author')).toHaveValue('Test Author');
    expect(screen.getByTestId('filter-search')).toHaveValue('test');
  });
});

