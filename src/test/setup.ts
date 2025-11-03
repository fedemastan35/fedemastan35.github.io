import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Setup for jsdom environment - ensure Node.js globals are available
if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Ensure Map and WeakMap are available for webidl-conversions
if (typeof Map === 'undefined') {
  // Map should always be available in Node.js, but ensure it's on globalThis
  globalThis.Map = Map;
  globalThis.WeakMap = WeakMap;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

