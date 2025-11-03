// Open Library API types
export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  edition_count?: number;
  language?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryBook[];
}

export interface OpenLibraryWork {
  key: string;
  title: string;
  authors?: Array<{
    author: {
      key: string;
    };
    type: {
      key: string;
    };
  }>;
  first_publish_date?: string;
  description?: string | {
    type: string;
    value: string;
  };
  covers?: number[];
  isbn_10?: string[];
  isbn_13?: string[];
  languages?: Array<{
    key: string;
  }>;
  subjects?: string[];
}

// Personal book tracking types
export type ReadingStatus = 'want-to-read' | 'reading' | 'completed';

export interface TrackedBook {
  id: string;
  olid: string; // Open Library ID
  title: string;
  author?: string;
  publishedYear?: number;
  isbn?: string;
  coverUrl?: string;
  status: ReadingStatus;
  rating?: number; // 1-5
  notes?: string;
  dateAdded: string;
  dateStarted?: string;
  dateCompleted?: string;
}

export interface BookFilters {
  status?: ReadingStatus;
  rating?: number;
  author?: string;
  searchQuery?: string;
}

