import { useState } from 'react';
import { searchBooks, extractOLID, getCoverUrl } from '../services/openLibraryApi';
import type { OpenLibraryBook } from '../types/book';
import './BookSearch.css';

interface BookSearchProps {
  onBookSelect: (book: OpenLibraryBook) => void;
}

export function BookSearch({ onBookSelect }: BookSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OpenLibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchBooks(query, 20);
      setResults(response.docs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search books');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book: OpenLibraryBook) => {
    onBookSelect(book);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="book-search" data-testid="book-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books by title or author..."
          className="search-input"
          data-testid="search-input"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="search-button"
          data-testid="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="search-error" data-testid="search-error">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results" data-testid="search-results">
          <h3>Search Results ({results.length})</h3>
          <div className="results-grid">
            {results.map((book) => {
              const olid = extractOLID(book.key);
              const coverUrl = book.cover_i
                ? getCoverUrl(book.cover_i, 'M')
                : undefined;

              return (
                <div
                  key={book.key}
                  className="search-result-item"
                  onClick={() => handleSelectBook(book)}
                  data-testid={`search-result-${olid}`}
                >
                  <div className="result-cover">
                    {coverUrl ? (
                      <img src={coverUrl} alt={book.title} />
                    ) : (
                      <div className="result-placeholder">📚</div>
                    )}
                  </div>
                  <div className="result-info">
                    <h4>{book.title}</h4>
                    {book.author_name && (
                      <p className="result-author">{book.author_name[0]}</p>
                    )}
                    {book.first_publish_year && (
                      <p className="result-year">{book.first_publish_year}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="add-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectBook(book);
                    }}
                    data-testid={`add-button-${olid}`}
                  >
                    Add to Collection
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

