import { act, renderHook } from '@testing-library/react-hooks';
import { useWire } from './use-wire';
import { useInterferer } from './use-interferer';

describe('useInterferer', () => {
  it('should have undefined value if upLink wire have undefined value', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null);
      const wire2 = useInterferer<string>(wire1, s => s.toUpperCase());
      return { wire1, wire2 };
    });

    expect(result.current.wire1.getValue()).toBeUndefined();
    expect(result.current.wire2.getValue()).toBeUndefined();
  });

  it('should not change up-link wire', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null, 'hi');
      const wire2 = useInterferer<string>(wire1, s => s.toUpperCase());
      return { wire1, wire2 };
    });

    expect(result.current.wire1.getValue()).toBe('hi');
    expect(result.current.wire2.getValue()).toBe('hi');
  });

  it('should interfere with returned wire values', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null);
      const wire2 = useInterferer<string>(wire1, s => s.toUpperCase());
      const wire3 = useWire<string>(wire2, 'hi');
      return { wire1, wire2, wire3 };
    });

    expect(result.current.wire1.getValue()).toBe('HI');
    expect(result.current.wire2.getValue()).toBe('HI');
    expect(result.current.wire3.getValue()).toBe('HI');
  });

  it('should interfere with returned wire setValue functions', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null);
      const wire2 = useInterferer<string>(wire1, s => s.toUpperCase());
      const wire3 = useWire<string>(wire2, 'hi');
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire2.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('BYE');
    expect(result.current.wire2.getValue()).toBe('BYE');
    expect(result.current.wire3.getValue()).toBe('BYE');
  });

  it('should not interfere with up-link setValue functions', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null);
      const wire2 = useInterferer<string>(wire1, s => s.toUpperCase());
      const wire3 = useWire<string>(wire2, 'hi');
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire1.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('bye');
    expect(result.current.wire2.getValue()).toBe('bye');
    expect(result.current.wire3.getValue()).toBe('bye');
  });

  it('should not change wires value if interferer function returns undefined', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null, 'hi');
      const wire2 = useInterferer<string>(wire1, () => undefined);
      return { wire1, wire2 };
    });

    act(() => {
      result.current.wire2.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('hi');
    expect(result.current.wire2.getValue()).toBe('hi');
  });
  it('should not change wires value if interferer function returns the old value', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null, 'hi');
      const wire2 = useInterferer<string>(wire1, (n, p) => p);
      return { wire1, wire2 };
    });

    act(() => {
      result.current.wire2.setValue('bye');
    });

    expect(result.current.wire1.getValue()).toBe('hi');
    expect(result.current.wire2.getValue()).toBe('hi');
  });
  it('should apply all interferer', () => {
    const { result } = renderHook(() => {
      const wire1 = useWire<string>(null, 'hi');
      const wire2 = useInterferer<string>(wire1, s => s.toUpperCase());
      const wire3 = useInterferer<string>(wire2, s => s.replace(/\d+/, ''));
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
      const wire1 = useWire<string>(null, 'hi');
      const wire2 = useInterferer<string>(wire1, s => s.toLowerCase());
      const wire3 = useInterferer<string>(wire2, s => s.toUpperCase());
      return { wire1, wire2, wire3 };
    });

    act(() => {
      result.current.wire3.setValue('Bye');
    });

    expect(result.current.wire1.getValue()).toBe('bye');
    expect(result.current.wire2.getValue()).toBe('bye');
    expect(result.current.wire3.getValue()).toBe('bye');
  });
});
