import { describe, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import { act, renderHook } from './render-hook';

describe('test renderer', function () {
  it('should render once without strict mode', function () {
    const fn = vi.fn();
    const effect = vi.fn();
    const clean = vi.fn();
    const { unmount } = renderHook(
      () => {
        fn();
        useEffect(() => {
          effect();
          return clean;
        });
      },
      { strict: false },
    );
    expect(fn).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(1);
    expect(clean).toHaveBeenCalledTimes(0);

    act(() => {
      unmount();
    });
    expect(clean).toHaveBeenCalledTimes(1);
  });
  it('should render twice with strict mode', function () {
    const fn = vi.fn();
    const effect = vi.fn();
    const clean = vi.fn();
    const { unmount } = renderHook(() => {
      fn();
      useEffect(() => {
        effect();
        return clean;
      });
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenCalledTimes(2);
    expect(clean).toHaveBeenCalledTimes(1);
    act(() => {
      unmount();
    });
    expect(clean).toHaveBeenCalledTimes(2);
  });
  it('should returns rerender function', function () {
    const { rerender } = renderHook(() => {
      return {};
    });
    rerender();
  });
  it('should accept new props for rerender', function () {
    const { result, rerender } = renderHook(
      (n: number) => {
        return { n };
      },
      { initialProps: 5 },
    );
    expect(result.current.n).toBe(5);
    rerender(6);
    expect(result.current.n).toBe(6);
  });
});
