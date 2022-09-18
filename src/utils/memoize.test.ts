import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize';

describe('memoize', function () {
  it('should return a function', function () {
    expect(typeof memoize(() => {})).toBe('function');
  });
  it('should remember last call', function () {
    const fn = vi.fn();
    const memoized = memoize(fn);
    memoized();
    memoized();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('should remember last call with arguments', function () {
    const fn = vi.fn();
    const memoized = memoize(fn);
    memoized(1, 2, 3);
    memoized(1, 2, 3);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('should remember last call with different arguments', function () {
    const fn = vi.fn();
    const memoized = memoize(fn);
    memoized(1, 2, 3);
    memoized(4, 5, 6);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('should forget previous calls with different arguments', function () {
    const fn = vi.fn();
    const memoized = memoize(fn);
    memoized(1, 2, 3);
    memoized(4, 5, 6);
    memoized(1, 2, 3);
    expect(fn).toHaveBeenCalledTimes(3);
  });
  it('should returns memoized value', function () {
    const fn = vi.fn(() => []);
    const memoized = memoize(fn);
    const result1 = memoized();
    const result2 = memoized();
    expect(result1).toBe(result2);
  });
});
