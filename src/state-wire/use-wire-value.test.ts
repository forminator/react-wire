import { act, renderHook } from '@testing-library/react-hooks';
import { useStateWire } from './use-state-wire';
import { useWireValue } from './use-wire-value';

describe('useWireValue', () => {
  describe('initial value', () => {
    describe('without wire', () => {
      it('should return undefined', () => {
        const { result } = renderHook(() => {
          const value = useWireValue(null);
          return { value };
        });

        expect(result.current.value).toBeUndefined();
      });
    });
    describe('with wire', () => {
      describe('without initial value', () => {
        it('should return undefined', () => {
          const { result } = renderHook(() => {
            const wire = useStateWire<number>(null);
            const value = useWireValue(wire);
            return { value };
          });

          expect(result.current.value).toBeUndefined();
        });
      });

      describe('with initial value', () => {
        it('should return wire initial value', () => {
          const { result } = renderHook(() => {
            const wire = useStateWire(null, 5);
            const value = useWireValue(wire);
            return { value };
          });

          expect(result.current.value).toBe(5);
        });
      });
    });
    describe('with initial  value on sibling', () => {
      it('should return wire initial value', () => {
        const { result } = renderHook(() => {
          const parent = useStateWire<number>(null);
          const wire = useStateWire(parent, 4);
          const value = useWireValue(wire);
          const sibling = useStateWire(parent, 5);
          const siblingValue = useWireValue(sibling);
          return { value, siblingValue };
        });

        expect(result.current.value).toBe(4);
        expect(result.current.siblingValue).toBe(4);
      });
    });
    describe('with default value', () => {
      it('should returns default value', () => {
        const { result } = renderHook(() => {
          const wire = useStateWire<number>(null);
          const value = useWireValue(wire, 5);
          return { value };
        });

        expect(result.current.value).toBe(5);
      });
    });
  });

  describe('value', () => {
    it('should be updated when wire value updated', () => {
      const { result } = renderHook(() => {
        const wire = useStateWire(null, 5);
        const value = useWireValue(wire);
        return { value, wire };
      });

      act(() => {
        result.current.wire.setValue(6);
      });

      expect(result.current.value).toBe(6);
    });
  });
  describe('when wire changed', () => {
    it('should use the new wire value', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const value = useWireValue(firstWire ? wire1 : wire2);
          return { value, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      expect(result.current.value).toBe(6);
      expect(result.current.wire1.getValue()).toBe(5);
      expect(result.current.wire2.getValue()).toBe(6);
    });
    it('should updated when new wire changed', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const value = useWireValue(firstWire ? wire1 : wire2);
          return { value, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      act(() => {
        result.current.wire2.setValue(7);
      });
      expect(result.current.value).toBe(7);
      expect(result.current.wire1.getValue()).toBe(5);
      expect(result.current.wire2.getValue()).toBe(7);
    });
    it('should not updated when old wire changed', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const value = useWireValue(firstWire ? wire1 : wire2);
          return { value, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      act(() => {
        result.current.wire1.setValue(7);
      });
      expect(result.current.value).toBe(6);
      expect(result.current.wire1.getValue()).toBe(7);
      expect(result.current.wire2.getValue()).toBe(6);
    });
  });
});
