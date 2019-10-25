import { act, renderHook } from '@testing-library/react-hooks';
import { useWire, useWireState } from '.';

describe('useWireState', () => {
  describe('initial value', () => {
    describe('without wire', () => {
      describe('without initial value', () => {
        it('should return undefined value', () => {
          const { result } = renderHook(() => {
            const [value, setValue] = useWireState<number>(null);
            return { value, setValue };
          });

          expect(result.current.value).toBeUndefined();
        });
      });

      describe('with initial value', () => {
        it('should return initial value', () => {
          const { result } = renderHook(() => {
            const [value, setValue] = useWireState(null, 4);
            return { value, setValue };
          });

          expect(result.current.value).toBe(4);
        });
      });
    });

    describe('with wire', () => {
      describe('without initial value', () => {
        it('should return undefined value', () => {
          const { result } = renderHook(() => {
            const wire = useWire<number>(null);
            const [value, setValue] = useWireState<number>(wire);
            return { value, setValue, wire };
          });

          expect(result.current.value).toBeUndefined();
          expect(result.current.wire.getValue()).toBeUndefined();
        });
      });

      describe('with initial value on wire', () => {
        it('should return wire value', () => {
          const { result } = renderHook(() => {
            const wire = useWire<number>(null, 5);
            const [value, setValue] = useWireState<number>(wire);
            return { value, setValue, wire };
          });

          expect(result.current.value).toBe(5);
          expect(result.current.wire.getValue()).toBe(5);
        });
      });

      describe('with initial value on useState', () => {
        it('should update wire value', () => {
          const { result } = renderHook(() => {
            const wire = useWire<number>(null);
            const [value, setValue] = useWireState<number>(wire, 5);
            return { value, setValue, wire };
          });

          expect(result.current.value).toBe(5);
          expect(result.current.wire.getValue()).toBe(5);
        });
      });

      describe('with initial value on both', () => {
        it('should return wire value', () => {
          const { result } = renderHook(() => {
            const wire = useWire<number>(null, 5);
            const [value, setValue] = useWireState<number>(wire, 4);
            return { value, setValue, wire };
          });

          expect(result.current.value).toBe(5);
          expect(result.current.wire.getValue()).toBe(5);
        });
      });
    });
  });

  describe('value', () => {
    it('should be updated when wire value changed (without initial value)', () => {
      const { result } = renderHook(() => {
        const wire = useWire<number>(null);
        const [value, setValue] = useWireState<number>(wire);
        return { value, setValue, wire };
      });

      act(() => {
        result.current.wire.setValue(5);
      });

      expect(result.current.wire.getValue()).toBe(5);
      expect(result.current.value).toBe(5);
    });

    it('should be updated when wire value changed (with initial value)', () => {
      const { result } = renderHook(() => {
        const wire = useWire<number>(null, 4);
        const [value, setValue] = useWireState<number>(wire);
        return { value, setValue, wire };
      });

      act(() => {
        result.current.wire.setValue(5);
      });

      expect(result.current.wire.getValue()).toBe(5);
      expect(result.current.value).toBe(5);
    });
  });

  describe('setValue(value)', () => {
    describe('without wire', () => {
      it('should return updated value after calling setValue with value', () => {
        const { result } = renderHook(() => {
          const [value, setValue] = useWireState<number>(null);
          return { value, setValue };
        });
        act(() => {
          result.current.setValue(5);
        });
        expect(result.current.value).toBe(5);
      });
    });

    describe('with wire', () => {
      it('should return updated value after calling setValue with value', () => {
        const { result } = renderHook(() => {
          const [value, setValue] = useWireState(null, 4);
          return { value, setValue };
        });
        act(() => {
          result.current.setValue(5);
        });
        expect(result.current.value).toBe(5);
      });

      it('should update value and wire value', () => {
        const { result } = renderHook(() => {
          const wire = useWire<number>(null);
          const [value, setValue] = useWireState<number>(wire);
          return { value, setValue, wire };
        });
        act(() => {
          result.current.setValue(5);
        });

        expect(result.current.wire.getValue()).toBe(5);
        expect(result.current.value).toBe(5);
      });
    });
  });

  describe('setValue(fn)', () => {
    describe('without wire', () => {
      it('should not call updater function when value is undefined', () => {
        const fn = jest.fn(v => v + 1);
        const { result } = renderHook(() => {
          const [value, setValue] = useWireState<number>(null);
          return { value, setValue };
        });
        act(() => {
          result.current.setValue(fn);
        });
        expect(result.current.value).toBeUndefined();
        expect(fn).not.toBeCalled();
      });

      it('should update value', () => {
        const { result } = renderHook(() => {
          const [value, setValue] = useWireState(null, 4);
          return { value, setValue };
        });
        act(() => {
          result.current.setValue(v => v + 1);
        });
        expect(result.current.value).toBe(5);
      });
    });

    describe('with wire', () => {
      it('should not call updater function when value is undefined', () => {
        const fn = jest.fn(v => v + 1);
        const { result } = renderHook(() => {
          const wire = useWire<number>(null);
          const [value, setValue] = useWireState<number>(wire);
          return { value, setValue, wire };
        });
        act(() => {
          result.current.setValue(fn);
        });

        expect(result.current.wire.getValue()).toBeUndefined();
        expect(result.current.value).toBeUndefined();
        expect(fn).not.toBeCalled();
      });

      it('should update value and wire value', () => {
        const fn = jest.fn(v => v + 1);
        const { result } = renderHook(() => {
          const wire = useWire<number>(null, 4);
          const [value, setValue] = useWireState<number>(wire);
          return { value, setValue, wire };
        });
        act(() => {
          result.current.setValue(fn);
        });

        expect(result.current.wire.getValue()).toBe(5);
        expect(result.current.value).toBe(5);
        expect(fn).toBeCalled();
      });
    });
  });

  describe('when wire change', () => {
    it('should return new wire value', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useWire(null, 3);
          const wire2 = useWire(null, 4);
          const [value, setValue] = useWireState<number>(
            firstWire ? wire1 : wire2,
          );
          return { value, setValue, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      expect(result.current.value).toBe(4);
    });

    describe('from null wire', () => {
      it('should return wire value', () => {
        const { result, rerender } = renderHook(
          ({ firstWire }: { firstWire: boolean }) => {
            const wire1 = null;
            const wire2 = useWire(null, 4);
            const [value, setValue] = useWireState<number>(
              firstWire ? wire1 : wire2,
            );
            return { value, setValue, wire1, wire2 };
          },
          { initialProps: { firstWire: true } },
        );
        rerender({ firstWire: false });
        expect(result.current.value).toBe(4);
      });
    });

    describe('to null wire', () => {
      it('should return previous value', () => {
        const { result, rerender } = renderHook(
          ({ firstWire }: { firstWire: boolean }) => {
            const wire1 = useWire(null, 4);
            const wire2 = null;
            const [value, setValue] = useWireState<number>(
              firstWire ? wire1 : wire2,
            );
            return { value, setValue, wire1, wire2 };
          },
          { initialProps: { firstWire: true } },
        );
        rerender({ firstWire: false });
        expect(result.current.value).toBe(4);
      });
    });
  });

  describe('multiple state on wire', () => {
    it('should return same values', () => {
      const { result } = renderHook(() => {
        const wire = useWire<number>(null);
        const [value1, setValue1] = useWireState(wire, 4);
        const [value2, setValue2] = useWireState(wire, 5);
        return { value1, setValue1, value2, setValue2, wire };
      });
      const wireValue = result.current.wire.getValue();
      expect(wireValue).toBe(4); // first wire
      expect(result.current.value1).toBe(wireValue);
      expect(result.current.value2).toBe(wireValue);
    });

    it('should return same values', () => {
      const { result } = renderHook(() => {
        const wire = useWire<number>(null, 3);
        const [value1, setValue1] = useWireState(wire, 4);
        const [value2, setValue2] = useWireState(wire, 5);
        return { value1, setValue1, value2, setValue2, wire };
      });
      const wireValue = result.current.wire.getValue();
      expect(wireValue).toBe(3); // first wire
      expect(result.current.value1).toBe(wireValue);
      expect(result.current.value2).toBe(wireValue);
    });

    it('should return same values after update', () => {
      const { result } = renderHook(() => {
        const wire = useWire<number>(null);
        const [value1, setValue1] = useWireState(wire, 4);
        const [value2, setValue2] = useWireState(wire, 5);
        return { value1, setValue1, value2, setValue2, wire };
      });
      act(() => {
        result.current.setValue1(6);
      });
      const wireValue = result.current.wire.getValue();
      expect(wireValue).toBe(6);
      expect(result.current.value1).toBe(wireValue);
      expect(result.current.value2).toBe(wireValue);
    });
  });
});
