import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchBooks, getBookDetails, getCoverUrl, extractOLID } from '../openLibraryApi';

// Mock fetch globally
global.fetch = vi.fn();

describe('openLibraryApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchBooks', () => {
    it('should search books successfully', async () => {
      const mockResponse = {
        numFound: 2,
        start: 0,
        numFoundExact: true,
        docs: [
          {
            key: '/works/OL123W',
            title: 'Test Book',
            author_name: ['Test Author'],
            first_publish_year: 2020,
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchBooks('test query');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=test%20query&limit=20'
      );
      expect(result).toEqual(mockResponse);
      expect(result.docs).toHaveLength(1);
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(searchBooks('test')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(searchBooks('test')).rejects.toThrow('Network error');
    });

    it('should respect limit parameter', async () => {
      const mockResponse = {
        numFound: 10,
        start: 0,
        numFoundExact: true,
        docs: [],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchBooks('test', 5);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=test&limit=5'
      );
    });
  });

  describe('getBookDetails', () => {
    it('should fetch book details successfully', async () => {
      const mockResponse = {
        key: '/works/OL123W',
        title: 'Test Book',
        authors: [{ author: { key: '/authors/OL123A' } }],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getBookDetails('OL123W');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openlibrary.org/works/OL123W.json'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle 404 errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getBookDetails('INVALID')).rejects.toThrow();
    });
  });

  describe('getCoverUrl', () => {
    it('should generate cover URL with default size', () => {
      const url = getCoverUrl(12345);
      expect(url).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
    });

    it('should generate cover URL with custom size', () => {
      const url = getCoverUrl(12345, 'L');
      expect(url).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg');
    });

    it('should handle string cover IDs', () => {
      const url = getCoverUrl('12345', 'S');
      expect(url).toBe('https://covers.openlibrary.org/b/id/12345-S.jpg');
    });
  });

  describe('extractOLID', () => {
    it('should extract OLID from work key', () => {
      const olid = extractOLID('/works/OL123456W');
      expect(olid).toBe('OL123456W');
    });

    it('should return original value if no match', () => {
      const olid = extractOLID('OL123456W');
      expect(olid).toBe('OL123456W');
    });

    it('should handle complex paths', () => {
      const olid = extractOLID('/works/OL123W/editions');
      expect(olid).toBe('OL123W');
    });
  });
});

