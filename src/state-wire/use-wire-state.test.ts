import { act, renderHook } from '@testing-library/react-hooks';
import { useStateWire } from './use-state-wire';
import { useWireState } from './use-wire-state';

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

      describe('with initializer value', () => {
        it('should return initial value', () => {
          const { result } = renderHook(() => {
            const [value, setValue] = useWireState(null, () => 4);
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
            const wire = useStateWire<number>(null);
            const [value, setValue] = useWireState(wire);
            return { value, setValue, wire };
          });

          expect(result.current.value).toBeUndefined();
          expect(result.current.wire.getValue()).toBeUndefined();
        });
      });

      describe('with initial value on wire', () => {
        it('should return wire value', () => {
          const { result } = renderHook(() => {
            const wire = useStateWire<number>(null, 5);
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
            const wire = useStateWire<number>(null);
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
            const wire = useStateWire<number>(null, 5);
            const [value, setValue] = useWireState<number>(wire, 4);
            return { value, setValue, wire };
          });

          expect(result.current.value).toBe(5);
          expect(result.current.wire.getValue()).toBe(5);
        });
      });
      describe('with initial value on sibling', () => {
        it('should have synced value', () => {
          const { result } = renderHook(() => {
            const wire = useStateWire<number>(null);
            const [value] = useWireState<number>(wire, 5);
            const [siblingValue] = useWireState<number>(wire, 4);
            return { value, siblingValue, wire };
          });

          expect(result.current.value).toBe(5);
          expect(result.current.siblingValue).toBe(5);
          expect(result.current.wire.getValue()).toBe(5);
        });
      });
    });
  });

  describe('value', () => {
    it('should be updated when wire value changed (without initial value)', () => {
      const { result } = renderHook(() => {
        const wire = useStateWire<number>(null);
        const [value, setValue] = useWireState(wire);
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
        const wire = useStateWire<number>(null, 4);
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
          const wire = useStateWire<number>(null);
          const [value, setValue] = useWireState(wire);
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
        const fn = jest.fn((v) => v + 1);
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
          result.current.setValue((v) => v + 1);
        });
        expect(result.current.value).toBe(5);
      });
    });

    describe('with wire', () => {
      it('should not call updater function when value is undefined', () => {
        const fn = jest.fn((v) => v + 1);
        const { result } = renderHook(() => {
          const wire = useStateWire<number>(null);
          const [value, setValue] = useWireState(wire);
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
        const fn = jest.fn((v) => v + 1);
        const { result } = renderHook(() => {
          const wire = useStateWire<number>(null, 4);
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

  describe('multiple state on wire', () => {
    it('should return same values', () => {
      const { result } = renderHook(() => {
        const wire = useStateWire<number>(null);
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
        const wire = useStateWire<number>(null, 3);
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
        const wire = useStateWire<number>(null);
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

  describe('when up-link wire changed', () => {
    it('should return the new wire value', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const [value] = useWireState(firstWire ? wire1 : wire2);
          return { value };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      expect(result.current.value).toBe(6);
    });
    it('should return update the new wire value if it is undefined', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire<number | undefined>(null, 5);
          const wire2 = useStateWire<number | undefined>(null, undefined);
          useWireState(firstWire ? wire1 : wire2);
          return { wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });

      expect(result.current.wire2.getValue()).toBe(5);
    });

    it('should be updated with the new wire', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const [value] = useWireState(firstWire ? wire1 : wire2);
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
    });

    it('should not be updated with the old wire', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const [value] = useWireState(firstWire ? wire1 : wire2);
          return { value, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      act(() => {
        result.current.wire1.setValue(7);
      });
      expect(result.current.value).toBe(6);
      expect(result.current.wire2.getValue()).toBe(6);
    });

    it('should only updated the new wire', () => {
      const { result, rerender } = renderHook(
        ({ firstWire }: { firstWire: boolean }) => {
          const wire1 = useStateWire(null, 5);
          const wire2 = useStateWire(null, 6);
          const [value, setValue] = useWireState(firstWire ? wire1 : wire2);
          return { value, setValue, wire1, wire2 };
        },
        { initialProps: { firstWire: true } },
      );
      rerender({ firstWire: false });
      act(() => {
        result.current.setValue(7);
      });
      expect(result.current.value).toBe(7);
      expect(result.current.wire1.getValue()).toBe(5);
      expect(result.current.wire2.getValue()).toBe(7);
    });
  });
});
