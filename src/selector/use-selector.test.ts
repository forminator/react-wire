import { act, renderHook } from '../test/render-hook';
import { useEffect, useState } from 'react';
import { useWireValue } from '../state-wire/use-wire-value';
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
  it('should updated in sync with react useState', function () {
    const { result } = renderHook(() => {
      const wire = useWire(null, 0);
      const selector = useSelector({ get: ({ get }) => get(wire) * 2 });
      const selectorValue = useWireValue(selector);
      const [value, setValue] = useState(0);
      useEffect(() => {
        expect(selectorValue).toBe(value * 2);
      });
      return { wire, setValue };
    });
    act(() => {
      result.current.setValue(1);
      result.current.wire.setValue(1);
    });
  });
});
