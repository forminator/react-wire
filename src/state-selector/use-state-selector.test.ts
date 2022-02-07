import { useStateWire } from '../state-wire/use-state-wire';
import { useWireValue } from '../state-wire/use-wire-value';
import { act, renderHook } from '../test/render-hook';
import { useStateSelector } from './use-state-selector';

describe('use state selector', () => {
  it('should have correct initial value', () => {
    const { result } = renderHook(() => {
      const wire = useStateWire(null, 5);
      const selector = useStateSelector({ get: ({ get }) => get(wire) * 2 });
      const value = useWireValue(selector);
      return { value };
    });

    expect(result.current.value).toBe(10);
  });
  it('should have updated value', () => {
    const { result } = renderHook(() => {
      const wire = useStateWire(null, 5);
      const selector = useStateSelector({ get: ({ get }) => get(wire) * 2 });
      const value = useWireValue(selector);

      return { value, wire };
    });
    act(() => {
      result.current.wire.setValue(4);
    });
    expect(result.current.value).toBe(8);
  });
  it('should have updated value when dependencies changed', () => {
    const { result, rerender } = renderHook(
      ({ mul }: { mul: number }) => {
        const wire = useStateWire(null, 5);
        const selector = useStateSelector(
          { get: ({ get }) => get(wire) * mul },
          [mul],
        );
        const value = useWireValue(selector);

        return { value, wire };
      },
      { initialProps: { mul: 2 } },
    );
    act(() => {
      rerender({ mul: 3 });
    });
    expect(result.current.value).toBe(15);
  });
});
