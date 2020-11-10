import { useState } from 'react';

let errorDisplayed = false;

export function useStabilityGuard(wire: unknown | null | undefined) {
  const [preWire] = useState(wire);
  if (preWire !== wire && !errorDisplayed) {
    errorDisplayed = true;
    console.warn('Please avoid changing the wire variable.');
  }
}
