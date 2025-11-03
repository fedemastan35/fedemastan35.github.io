import { test, expect } from '@playwright/test';

const BASE_URL = 'https://openlibrary.org';

test.describe('Open Library API Tests', () => {
  test('should search for books successfully', async ({ request }) => {
    const query = 'The Great Gatsby';
    const response = await request.get(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=5`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('numFound');
    expect(data).toHaveProperty('docs');
    expect(Array.isArray(data.docs)).toBe(true);
    expect(data.docs.length).toBeGreaterThan(0);

    // Verify book structure
    const book = data.docs[0];
    expect(book).toHaveProperty('key');
    expect(book).toHaveProperty('title');
  });

  test('should handle empty search results', async ({ request }) => {
    const query = 'asdfghjklqwertyuiopzxcvbnm123456789';
    const response = await request.get(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=5`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('numFound');
    expect(data.numFound).toBe(0);
    expect(data.docs).toEqual([]);
  });

  test('should fetch book details by work ID', async ({ request }) => {
    // Using a known work ID
    const workId = 'OL82563W'; // The Great Gatsby
    const response = await request.get(`${BASE_URL}/works/${workId}.json`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('key');
    expect(data).toHaveProperty('title');
  });

  test('should handle invalid work ID', async ({ request }) => {
    const workId = 'INVALID_ID_12345';
    const response = await request.get(`${BASE_URL}/works/${workId}.json`);

    expect(response.status()).toBe(404);
  });

  test('should search with special characters', async ({ request }) => {
    const query = 'Café & Books';
    const response = await request.get(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=5`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('docs');
  });

  test('should respect limit parameter', async ({ request }) => {
    const query = 'harry potter';
    const limit = 3;
    const response = await request.get(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.docs.length).toBeLessThanOrEqual(limit);
  });

  test('should return cover image URL structure', async ({ request }) => {
    const query = '1984';
    const response = await request.get(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=1`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    if (data.docs.length > 0 && data.docs[0].cover_i) {
      const coverId = data.docs[0].cover_i;
      const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
      
      const coverResponse = await request.head(coverUrl);
      // Cover images might return 200, 404, or redirect, so we just check it's a valid HTTP response
      expect([200, 301, 302, 404]).toContain(coverResponse.status());
    }
  });

  test('should search by author name', async ({ request }) => {
    const query = 'author:"George Orwell"';
    const response = await request.get(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=5`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.docs.length).toBeGreaterThan(0);

    // Verify that results contain the author
    type Doc = { author_name?: string[] };
    const hasOrwell = (data.docs as Doc[]).some((book) => 
      book.author_name?.some((author) => 
        author.toLowerCase().includes('orwell')
      )
    );

    expect(hasOrwell).toBe(true);
  });
});

