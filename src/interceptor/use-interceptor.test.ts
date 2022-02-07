import { useStateWire } from '../state-wire/use-state-wire';
import { act, renderHook } from '../test/render-hook';
import { useInterceptor } from './use-interceptor';

describe('useInterceptor', () => {
  it('should have undefined value if upLink wire have undefined value', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null);
      const wire2 = useInterceptor(wire1, (s) => s.toUpperCase());
      return { wire1, wire2 };
    });

    expect(result.current.wire1.getValue()).toBeUndefined();
    expect(result.current.wire2.getValue()).toBeUndefined();
  });

  it('should not change up-link wire', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null, 'hi');
      const wire2 = useInterceptor(wire1, (s) => s.toUpperCase());
      return { wire1, wire2 };
    });

    expect(result.current.wire1.getValue()).toBe('hi');
    expect(result.current.wire2.getValue()).toBe('hi');
  });

  it('should intercept with returned wire values', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null);
      const wire2 = useInterceptor(wire1, (s) => s.toUpperCase());
      const wire3 = useStateWire<string>(wire2, 'hi');
      return { wire1, wire2, wire3 };
    });

    expect(result.current.wire1.getValue()).toBe('HI');
    expect(result.current.wire2.getValue()).toBe('HI');
    expect(result.current.wire3.getValue()).toBe('HI');
  });

  it('should intercept with returned wire setValue functions', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null);
      const wire2 = useInterceptor(wire1, (s) => s.toUpperCase());
      const wire3 = useStateWire<string>(wire2, 'hi');
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire2.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('BYE');
    expect(result.current.wire2.getValue()).toBe('BYE');
    expect(result.current.wire3.getValue()).toBe('BYE');
  });

  it('should not intercept with up-link setValue functions', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null);
      const wire2 = useInterceptor(wire1, (s) => s.toUpperCase());
      const wire3 = useStateWire<string>(wire2, 'hi');
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire1.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('bye');
    expect(result.current.wire2.getValue()).toBe('bye');
    expect(result.current.wire3.getValue()).toBe('bye');
  });

  it('should not change wires value if interceptor function returns undefined', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null, 'hi');
      const wire2 = useInterceptor(wire1, () => undefined);
      return { wire1, wire2 };
    });

    act(() => {
      result.current.wire2.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('hi');
    expect(result.current.wire2.getValue()).toBe('hi');
  });
  it('should not change wires value if interceptor function returns the old value', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null, 'hi');
      const wire2 = useInterceptor(wire1, (n, p) => p);
      return { wire1, wire2 };
    });

    act(() => {
      result.current.wire2.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('hi');
    expect(result.current.wire2.getValue()).toBe('hi');
  });
  it('should apply all interceptor', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null, 'hi');
      const wire2 = useInterceptor(wire1, (s) => s.toUpperCase());
      const wire3 = useInterceptor(wire2, (s) => s.replace(/\d+/, ''));
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire3.setValue('user45');
    });

    expect(result.current.wire1.getValue()).toBe('USER');
    expect(result.current.wire2.getValue()).toBe('USER');
    expect(result.current.wire3.getValue()).toBe('USER');
  });
  it('should apply from down to up', () => {
    const { result } = renderHook(() => {
      const wire1 = useStateWire<string>(null, 'hi');
      const wire2 = useInterceptor(wire1, (s) => s.toLowerCase());
      const wire3 = useInterceptor(wire2, (s) => s.toUpperCase());
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire3.setValue('Bye');
    });

    expect(result.current.wire1.getValue()).toBe('bye');
    expect(result.current.wire2.getValue()).toBe('bye');
    expect(result.current.wire3.getValue()).toBe('bye');
  });

  describe('interceptor changed', () => {
    it('should use updated interceptor', () => {
      const { result, rerender } = renderHook(
        ({ m }: { m: number }) => {
          const wire1 = useStateWire(null, 3);
          const wire2 = useInterceptor(wire1, (s) => Math.min(s, m));
          return { wire1, wire2 };
        },
        { initialProps: { m: 10 } },
      );
      rerender({ m: 20 });

      act(() => {
        result.current.wire2.setValue(30);
      });

      expect(result.current.wire1.getValue()).toBe(20);
      expect(result.current.wire2.getValue()).toBe(20);
    });
  });

  describe('wire changed', () => {
    it('should use updated wire', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 3);
          const wire2 = useStateWire(null, 5);
          const wire = useInterceptor(firstWire ? wire1 : wire2, (s) =>
            Math.min(s, 10),
          );
          return { wire, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      expect(result.current.wire.getValue()).toBe(5);

      act(() => {
        result.current.wire.setValue(30);
      });

      expect(result.current.wire1.getValue()).toBe(3);
      expect(result.current.wire2.getValue()).toBe(10);
    });
  });
});
