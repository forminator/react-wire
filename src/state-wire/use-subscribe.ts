import { useEffect } from 'react';
import { Defined } from '../utils/type-utils';
import { useStabilityGuard } from '../utils/use-stability-guard';
import { ReadonlyStateWire } from './readonly-state-wire';

export function useSubscribe<V>(
  wire: ReadonlyStateWire<V>,
  callback: (value: Defined<V>) => void,
): void {
  useStabilityGuard(wire);
  useEffect(() => {
    return wire.subscribe(callback);
  }, [wire, callback]);
}
