import { renderHook } from '@testing-library/react-hooks';
import { useStateWire } from '../state-wire/use-state-wire';
import { useStabilityGuard } from './use-stability-guard';

describe('useStabilityGuard', () => {
  it('should throw error if wire changed', () => {
    const { result, rerender } = renderHook(
      ({ firstWire }: { firstWire: boolean }) => {
        const wire1 = useStateWire(null, 5);
        const wire2 = useStateWire(null, 6);
        useStabilityGuard(firstWire ? wire1 : wire2);
        return {};
      },
      { initialProps: { firstWire: true } },
    );
    rerender({ firstWire: false });

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe('wire argument changed');
  });
});
