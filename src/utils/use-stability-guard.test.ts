import { renderHook } from '@testing-library/react-hooks';
import { useStateWire } from '../state-wire/use-state-wire';
import { useStabilityGuard } from './use-stability-guard';

describe('useStabilityGuard', () => {
  it('should throw error if wire changed', () => {
    const spy = jest.spyOn(global.console, 'warn');
    spy.mockImplementation(() => {});
    const { rerender } = renderHook(
      ({ firstWire }: { firstWire: boolean }) => {
        const wire1 = useStateWire(null, 5);
        const wire2 = useStateWire(null, 6);
        useStabilityGuard(firstWire ? wire1 : wire2);
        return {};
      },
      { initialProps: { firstWire: true } },
    );
    rerender({ firstWire: false });

    expect(spy).toBeCalledWith('Please avoid changing the wire variable.');
    spy.mockRestore();
  });
});
