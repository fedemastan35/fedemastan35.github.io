import type { ReadingStatus } from '../types/book';
import './FilterBar.css';

interface FilterBarProps {
  statusFilter?: ReadingStatus;
  ratingFilter?: number;
  authorFilter?: string;
  searchQuery?: string;
  onStatusChange: (status?: ReadingStatus) => void;
  onRatingChange: (rating?: number) => void;
  onAuthorChange: (author?: string) => void;
  onSearchChange: (query?: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  statusFilter,
  ratingFilter,
  authorFilter,
  searchQuery,
  onStatusChange,
  onRatingChange,
  onAuthorChange,
  onSearchChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = statusFilter || ratingFilter || authorFilter || searchQuery;

  return (
    <div className="filter-bar" data-testid="filter-bar">
      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          value={statusFilter || ''}
          onChange={(e) => onStatusChange(e.target.value ? (e.target.value as ReadingStatus) : undefined)}
          data-testid="filter-status"
        >
          <option value="">All</option>
          <option value="want-to-read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="rating-filter">Rating:</label>
        <select
          id="rating-filter"
          value={ratingFilter || ''}
          onChange={(e) => onRatingChange(e.target.value ? parseInt(e.target.value) : undefined)}
          data-testid="filter-rating"
        >
          <option value="">All</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="author-filter">Author:</label>
        <input
          id="author-filter"
          type="text"
          value={authorFilter || ''}
          onChange={(e) => onAuthorChange(e.target.value || undefined)}
          placeholder="Filter by author..."
          data-testid="filter-author"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="search-filter">Search:</label>
        <input
          id="search-filter"
          type="text"
          value={searchQuery || ''}
          onChange={(e) => onSearchChange(e.target.value || undefined)}
          placeholder="Search collection..."
          data-testid="filter-search"
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="clear-filters-btn"
          data-testid="clear-filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

