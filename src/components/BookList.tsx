import type { TrackedBook } from '../types/book';
import { BookCard } from './BookCard';
import './BookList.css';

interface BookListProps {
  books: TrackedBook[];
  onEdit: (book: TrackedBook) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TrackedBook['status']) => void;
  onRatingChange: (id: string, rating: number) => void;
}

export function BookList({ books, onEdit, onDelete, onStatusChange, onRatingChange }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="book-list-empty" data-testid="book-list-empty">
        <p>No books in your collection yet. Search for books to add them!</p>
      </div>
    );
  }

  return (
    <div className="book-list" data-testid="book-list">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onRatingChange={onRatingChange}
        />
      ))}
    </div>
  );
}

