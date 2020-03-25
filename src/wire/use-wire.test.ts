import { renderHook } from '@testing-library/react-hooks';
import { useWireState } from '../state-wire/use-wire-state';
import { useWire } from './use-wire';

describe('use-wire', () => {
  it('should return wire', () => {
    const { result } = renderHook(() => {
      const wire = useWire(null, 3);
      const [value, setValue] = useWireState(wire);
      return { value, setValue };
    });

    expect(result.current.value).toBe(3);
  });
});
