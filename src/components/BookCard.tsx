import { useState } from 'react';
import type { TrackedBook } from '../types/book';
import './BookCard.css';

interface BookCardProps {
  book: TrackedBook;
  onEdit: (book: TrackedBook) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TrackedBook['status']) => void;
  onRatingChange: (id: string, rating: number) => void;
}

export function BookCard({ book, onEdit, onDelete, onStatusChange, onRatingChange }: BookCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(book.id, e.target.value as TrackedBook['status']);
  };

  const handleRatingChange = (rating: number) => {
    onRatingChange(book.id, rating);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(book.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="book-card" data-testid={`book-card-${book.id}`}>
      <div className="book-card-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div className="book-card-placeholder">📚</div>
        )}
      </div>
      
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        {book.author && <p className="book-card-author">by {book.author}</p>}
        
        {book.publishedYear && (
          <p className="book-card-year">{book.publishedYear}</p>
        )}

        <div className="book-card-status">
          <label htmlFor={`status-${book.id}`}>Status:</label>
          <select
            id={`status-${book.id}`}
            value={book.status}
            onChange={handleStatusChange}
            data-testid={`status-select-${book.id}`}
          >
            <option value="want-to-read">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="book-card-rating">
          <label>Rating:</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${book.rating && star <= book.rating ? 'filled' : ''}`}
                onClick={() => handleRatingChange(star)}
                aria-label={`Rate ${star} stars`}
                data-testid={`star-${star}-${book.id}`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {book.notes && (
          <div className="book-card-notes">
            <p>{book.notes}</p>
          </div>
        )}

        <div className="book-card-actions">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="btn-edit"
            data-testid={`edit-btn-${book.id}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-delete"
            data-testid={`delete-btn-${book.id}`}
          >
            {showDeleteConfirm ? 'Confirm?' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

