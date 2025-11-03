# 📚 Book Tracker

A modern book tracking web application built with React, TypeScript, and integrated with the Open Library API. This project showcases comprehensive testing capabilities including unit tests, API tests, UI tests, and visual regression tests using Playwright.

## Features

- 🔍 **Book Search**: Search for books using the Open Library API
- 📖 **Collection Management**: Add, edit, and delete books from your personal collection
- 🏷️ **Reading Status**: Track books as "Want to Read", "Reading", or "Completed"
- ⭐ **Rating System**: Rate books from 1 to 5 stars
- 📝 **Notes**: Add personal notes to your books
- 🔎 **Filtering**: Filter your collection by status, rating, author, or search query
- 💾 **Local Storage**: All data is persisted in your browser's localStorage

## Tech Stack

- **React 19** with **TypeScript**
- **Vite** for build tooling
- **Open Library API** for book data
- **Vitest** for unit testing
- **Playwright** for E2E, API, and visual testing
- **GitHub Pages** for deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bookS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing

This project includes comprehensive testing at multiple levels:

### Unit Tests

Run unit tests with Vitest:
```bash
npm test
```

Run with UI:
```bash
npm run test:ui
```

Run with coverage:
```bash
npm run test:coverage
```

### E2E Tests (Playwright)

Run Playwright tests:
```bash
npm run test:e2e
```

Run with UI:
```bash
npm run test:e2e:ui
```

### Test Structure

- **Unit Tests**: `src/services/__tests__/` and `src/components/__tests__/`
  - API service tests
  - Storage service tests
  - Component tests

- **API Tests**: `tests/api/`
  - Open Library API integration tests
  - Error handling tests
  - Response validation tests

- **UI Tests**: `tests/ui/`
  - CRUD operations
  - Search functionality
  - Filtering and sorting
  - User interactions

- **Visual Tests**: `tests/visual/`
  - Visual regression tests
  - Component snapshots
  - Layout validation

## Project Structure

```
bookS/
├── src/
│   ├── components/          # React components
│   │   ├── BookCard.tsx
│   │   ├── BookList.tsx
│   │   ├── BookSearch.tsx
│   │   ├── BookForm.tsx
│   │   └── FilterBar.tsx
│   ├── services/            # API and storage services
│   │   ├── openLibraryApi.ts
│   │   └── bookStorage.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useBooks.ts
│   ├── types/              # TypeScript types
│   │   └── book.ts
│   └── test/               # Test setup
│       └── setup.ts
├── tests/                  # Playwright tests
│   ├── api/               # API tests
│   ├── ui/                # UI tests
│   ├── visual/            # Visual tests
│   └── playwright.config.ts
└── public/                 # Static assets
```

## Deployment to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub username:
```json
"homepage": "https://<your-username>.github.io/bookS"
```

2. Build and deploy:
```bash
npm run deploy
```

This will:
- Build the production bundle
- Deploy to the `gh-pages` branch
- Make your site available at `https://<your-username>.github.io/bookS`

## API Usage

This application uses the [Open Library API](https://openlibrary.org/developers/api) for book data. The API provides:

- Book search functionality
- Book details and metadata
- Cover images
- Author information

No API key is required for basic usage.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a showcase project for testing skills. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests for new features
4. Submit a pull request

## License

This project is open source and available for educational purposes.
