import { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import { BookSearch } from './components/BookSearch';
import { BookList } from './components/BookList';
import { BookForm } from './components/BookForm';
import { FilterBar } from './components/FilterBar';
import type { TrackedBook } from './types/book';
import type { OpenLibraryBook } from './types/book';
import { getCoverUrl } from './services/openLibraryApi';
import './App.css';

function App() {
  const {
    books,
    addBook,
    removeBook,
    updateStatus,
    updateRating,
    filters,
    setFilter,
    clearFilters,
  } = useBooks();

  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<TrackedBook | undefined>();
  const [selectedBook, setSelectedBook] = useState<OpenLibraryBook | undefined>();

  const handleBookSelect = (book: OpenLibraryBook) => {
    setSelectedBook(book);
    setShowBookForm(true);
  };

  const handleAddClick = () => {
    setEditingBook(undefined);
    setSelectedBook(undefined);
    setShowBookForm(true);
  };

  const handleEdit = (book: TrackedBook) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleSave = (book: TrackedBook) => {
    addBook(book);
    setShowBookForm(false);
    setEditingBook(undefined);
    setSelectedBook(undefined);
  };

  const handleCancel = () => {
    setShowBookForm(false);
    setEditingBook(undefined);
    setSelectedBook(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      removeBook(id);
    }
  };

  // Convert OpenLibraryBook to TrackedBook format
  const getBookForForm = (): TrackedBook | OpenLibraryBook | undefined => {
    if (editingBook) return editingBook;
    if (selectedBook) {
      return {
        ...selectedBook,
        coverUrl: selectedBook.cover_i ? getCoverUrl(selectedBook.cover_i, 'M') : undefined,
      };
    }
    return undefined;
  };

  return (
    <div className="app" data-testid="app">
      <header className="app-header">
        <h1>📚 Book Tracker</h1>
        <p>Track your reading journey</p>
      </header>

      <main className="app-main">
        <div className="app-controls">
          <button
            type="button"
            onClick={handleAddClick}
            className="btn-add-book"
            data-testid="add-book-button"
          >
            + Add Book Manually
          </button>
        </div>

        <BookSearch onBookSelect={handleBookSelect} />

        <FilterBar
          statusFilter={filters.status}
          ratingFilter={filters.rating}
          authorFilter={filters.author}
          searchQuery={filters.searchQuery}
          onStatusChange={(status) => setFilter({ status })}
          onRatingChange={(rating) => setFilter({ rating })}
          onAuthorChange={(author) => setFilter({ author })}
          onSearchChange={(query) => setFilter({ searchQuery: query })}
          onClearFilters={clearFilters}
        />

        <BookList
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={updateStatus}
          onRatingChange={updateRating}
        />

        {showBookForm && (
          <BookForm
            book={getBookForForm()}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}

export default App;
