import { act, renderHook } from '@testing-library/react-hooks';
import { useWire, useWireValue } from '.';

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
            const wire = useWire(null);
            const value = useWireValue(wire);
            return { value };
          });

          expect(result.current.value).toBeUndefined();
        });
      });

      describe('with initial value', () => {
        it('should return wire initial value', () => {
          const { result } = renderHook(() => {
            const wire = useWire(null, 5);
            const value = useWireValue(wire);
            return { value };
          });

          expect(result.current.value).toBe(5);
        });
      });
    });
    describe('with default value', () => {
      it('should returns default value', () => {
        const { result } = renderHook(() => {
          const wire = useWire(null);
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
        const wire = useWire(null, 5);
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
    it('should have new wire value', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useWire(null, 5);
          const wire2 = useWire(null, 6);

          const value = useWireValue(firstWire ? wire1 : wire2);
          return { value };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      expect(result.current.value).toBe(6);
    });
    it('should return updated value', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useWire(null, 5);
          const wire2 = useWire(null, 6);
          const value = useWireValue(firstWire ? wire1 : wire2);
          return { value, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      act(() => {
        result.current.wire2.setValue(61);
      });
      expect(result.current.value).toBe(61);
    });

    it('should not care about old wire', () => {
      const fn = jest.fn();
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useWire(null, 5);
          const wire2 = useWire(null, 6);
          const value = useWireValue(firstWire ? wire1 : wire2);
          fn(); // render count
          return { value, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      expect(fn).toBeCalledTimes(3);
      act(() => {
        result.current.wire1.setValue(51);
      });
      expect(fn).toBeCalledTimes(3); // same as before calling wire1.setValue
      expect(result.current.value).toBe(6);
    });

    describe('from null wire', () => {
      it('should return wire value', () => {
        const { result, rerender } = renderHook(
          ({ firstWire }: { firstWire: boolean }) => {
            const wire1 = null;
            const wire2 = useWire(null, 5);
            const value = useWireValue(firstWire ? wire1 : wire2);
            return { value };
          },
          { initialProps: { firstWire: true } },
        );

        rerender({ firstWire: false });
        expect(result.current.value).toBe(5);
      });
    });

    describe('to null wire', () => {
      it('should return undefined', () => {
        const { result, rerender } = renderHook(
          ({ firstWire }: { firstWire: boolean }) => {
            const wire1 = useWire(null, 5);
            const wire2 = null;
            const value = useWireValue(firstWire ? wire1 : wire2);
            return { value };
          },
          { initialProps: { firstWire: true } },
        );
        rerender({ firstWire: false });
        expect(result.current.value).toBeUndefined();
      });
    });
  });
});
