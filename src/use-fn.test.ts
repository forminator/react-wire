import { act, renderHook } from '@testing-library/react-hooks';
import { useFn } from './use-fn';
import { useWire } from './use-wire';

describe('useFn', () => {
  it('should subscribe on fns', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const wire = useWire<any, { test(n: number): void }>(null);
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
});
