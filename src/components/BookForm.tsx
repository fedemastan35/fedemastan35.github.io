import { useState, useEffect } from 'react';
import type { TrackedBook, ReadingStatus } from '../types/book';
import { extractOLID, getCoverUrl } from '../services/openLibraryApi';
import type { OpenLibraryBook } from '../types/book';
import './BookForm.css';

interface BookFormProps {
  book?: TrackedBook | OpenLibraryBook;
  onSave: (book: TrackedBook) => void;
  onCancel: () => void;
}

export function BookForm({ book, onSave, onCancel }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState<number | undefined>();
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [rating, setRating] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | undefined>();

  useEffect(() => {
    if (book) {
      if ('status' in book) {
        // TrackedBook
        const trackedBook = book as TrackedBook;
        setTitle(trackedBook.title);
        setAuthor(trackedBook.author || '');
        setPublishedYear(trackedBook.publishedYear);
        setIsbn(trackedBook.isbn || '');
        setStatus(trackedBook.status);
        setRating(trackedBook.rating);
        setNotes(trackedBook.notes || '');
        setCoverUrl(trackedBook.coverUrl);
      } else {
        // OpenLibraryBook
        const olBook = book as OpenLibraryBook;
        setTitle(olBook.title);
        setAuthor(olBook.author_name?.[0] || '');
        setPublishedYear(olBook.first_publish_year);
        setIsbn(olBook.isbn?.[0] || '');
        if (olBook.cover_i) {
          setCoverUrl(getCoverUrl(olBook.cover_i, 'M'));
        }
      }
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trackedBook: TrackedBook = {
      id: book && 'id' in book ? (book as TrackedBook).id : `book-${Date.now()}`,
      olid: book && 'key' in book ? extractOLID((book as OpenLibraryBook).key) : `olid-${Date.now()}`,
      title,
      author: author || undefined,
      publishedYear,
      isbn: isbn || undefined,
      coverUrl,
      status,
      rating,
      notes: notes || undefined,
      dateAdded: book && 'dateAdded' in book ? (book as TrackedBook).dateAdded : new Date().toISOString(),
      dateStarted: book && 'dateStarted' in book ? (book as TrackedBook).dateStarted : undefined,
      dateCompleted: book && 'dateCompleted' in book ? (book as TrackedBook).dateCompleted : undefined,
    };

    onSave(trackedBook);
  };

  return (
    <div className="book-form-overlay" data-testid="book-form">
      <div className="book-form-container">
        <h2>{book && 'id' in book ? 'Edit Book' : 'Add Book to Collection'}</h2>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="form-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              data-testid="form-author"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Published Year</label>
              <input
                id="year"
                type="number"
                value={publishedYear || ''}
                onChange={(e) => setPublishedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                data-testid="form-year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                id="isbn"
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                data-testid="form-isbn"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReadingStatus)}
              data-testid="form-status"
            >
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${rating && star <= rating ? 'filled' : ''}`}
                  onClick={() => setRating(rating === star ? undefined : star)}
                  aria-label={`Rate ${star} stars`}
                  data-testid={`form-star-${star}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              data-testid="form-notes"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel" data-testid="form-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" data-testid="form-save">
              {book && 'id' in book ? 'Update' : 'Add'} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

