import matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});
