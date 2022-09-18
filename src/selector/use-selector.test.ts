import { describe, expect, it } from 'vitest';
import { renderHook } from '../test/render-hook';
import { useWire } from '../wire/use-wire';
import { useSelector } from './use-selector';

describe('use-selector', () => {
  it('should return wire', () => {
    const { result } = renderHook(() => {
      const wire = useWire(null, 3);
      const selector = useSelector({ get: ({ get }) => get(wire) * 2 });
      return { selector };
    });

    expect(result.current.selector.getValue()).toBe(6);
  });
});
