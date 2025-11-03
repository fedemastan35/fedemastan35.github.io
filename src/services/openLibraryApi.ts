import type { OpenLibrarySearchResponse, OpenLibraryWork } from '../types/book';

const BASE_URL = 'https://openlibrary.org';
const COVER_BASE_URL = 'https://covers.openlibrary.org/b';

/**
 * Search for books using Open Library API
 */
export async function searchBooks(query: string, limit: number = 20): Promise<OpenLibrarySearchResponse> {
  const encodedQuery = encodeURIComponent(query);
  const url = `${BASE_URL}/search.json?q=${encodedQuery}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as OpenLibrarySearchResponse;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
}

/**
 * Get book details by Open Library ID
 */
export async function getBookDetails(olid: string): Promise<OpenLibraryWork> {
  const url = `${BASE_URL}/works/${olid}.json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as OpenLibraryWork;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}

/**
 * Get cover image URL for a book
 */
export function getCoverUrl(coverId: number | string, size: 'S' | 'M' | 'L' = 'M'): string {
  return `${COVER_BASE_URL}/id/${coverId}-${size}.jpg`;
}

/**
 * Extract Open Library ID from a key (e.g., "/works/OL123456W" -> "OL123456W")
 */
export function extractOLID(key: string): string {
  const match = key.match(/\/works\/([^/]+)/);
  return match ? match[1] : key;
}

