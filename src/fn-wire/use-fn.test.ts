import { act, renderHook } from '../test/render-hook';
import { FnsWire } from './fns-wire';
import { useFn } from './use-fn';
import { useFnsWire } from './use-fns-wire';

describe('useFn', () => {
  it('should subscribe on fns', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const wire = useFnsWire<{ test(n: number): void }>(null);
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should accept null or undefined wire', () => {
    const fn = jest.fn();
    const { result } = renderHook((): {
      wire: FnsWire<{ test(n: number): void }> | null;
    } => {
      const wire = null;
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire?.fns.test(3);
    });
    expect(fn).not.toBeCalled();
  });
  it('should subscribe on fns with parent', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire = useFnsWire<{ test(n: number): void }>(parent);
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should subscribe on fns with parent, listen on parent', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire = useFnsWire<{ test(n: number): void }>(parent);
      useFn(parent, 'test', fn);
      return { wire, parent };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should subscribe on fns with parent, fire on parent', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire = useFnsWire<{ test(n: number): void }>(parent);
      useFn(wire, 'test', fn);
      return { wire, parent };
    });
    act(() => {
      result.current.parent.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should subscribe on fns with sibling', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire1 = useFnsWire<{ test(n: number): void }>(parent);
      const wire2 = useFnsWire<{ test(n: number): void }>(parent);
      useFn(wire1, 'test', fn);
      return { wire1, wire2 };
    });
    act(() => {
      result.current.wire2.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  describe('when wire changed', () => {
    it('should subscribe to the new wire', () => {
      const fn = jest.fn();
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useFnsWire<{ test(n: number): void }>(null);
          const wire2 = useFnsWire<{ test(n: number): void }>(null);
          useFn(firstWire ? wire1 : wire2, 'test', fn);
          return { wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      act(() => {
        result.current.wire2.fns.test(3);
      });
      expect(fn).toBeCalledWith(3);
    });
    it('should unsubscribe from first wire ', () => {
      const fn = jest.fn();
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useFnsWire<{ test(n: number): void }>(null);
          const wire2 = useFnsWire<{ test(n: number): void }>(null);
          useFn(firstWire ? wire1 : wire2, 'test', fn);
          return { wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      act(() => {
        result.current.wire1.fns.test(3);
      });
      expect(fn).not.toBeCalled();
    });
  });
  describe('when up-link wire changed', () => {
    it('should subscribe to the new wire', () => {
      const fn = jest.fn();
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useFnsWire<{ test(n: number): void }>(null);
          const wire2 = useFnsWire<{ test(n: number): void }>(null);
          const wire = useFnsWire(firstWire ? wire1 : wire2);
          useFn(wire, 'test', fn);
          return { wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      act(() => {
        result.current.wire2.fns.test(3);
      });
      expect(fn).toBeCalledWith(3);
    });
    it('should unsubscribe from first wire ', () => {
      const fn = jest.fn();
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useFnsWire<{ test(n: number): void }>(null);
          const wire2 = useFnsWire<{ test(n: number): void }>(null);
          const wire = useFnsWire(firstWire ? wire1 : wire2);
          useFn(wire, 'test', fn);
          return { wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      act(() => {
        result.current.wire1.fns.test(3);
      });
      expect(fn).not.toBeCalled();
    });
  });
});
