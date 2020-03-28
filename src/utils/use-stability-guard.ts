import { useState } from 'react';

export function useStabilityGuard(wire: unknown | null | undefined) {
  const [preWire] = useState(wire);
  if (preWire !== wire) {
    throw new Error('wire argument changed');
  }
}
