import { useEffect, useState } from 'react';
import { useSelector } from './selector/use-selector';
import { useWireValue } from './state-wire/use-wire-value';
import { act, renderHook } from './test/render-hook';
import { useWire } from './wire/use-wire';

describe('sync with use state', function () {
  describe('wire', function () {
    it('should updated in sync with react useState', function () {
      const { result } = renderHook(() => {
        const wire = useWire(null, 0);
        const wireValue = useWireValue(wire);
        const [value, setValue] = useState(0);
        useEffect(() => {
          expect(wireValue).toBe(value);
        });
        return { wire, setValue };
      });
      act(() => {
        result.current.setValue(1);
        result.current.wire.setValue(1);
      });
    });
  });
  describe('selector', function () {
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
});
