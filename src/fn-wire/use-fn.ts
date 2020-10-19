import { useEffect } from 'react';
import { KeyOfMethods } from '../utils/type-utils';
import { useStabilityGuard } from '../utils/use-stability-guard';
import { FnsWire } from './fns-wire';

/**
 * 
 * subscribe for function calls
 * 
 * @param wire
 * @param name - name of `fns` function
 * @param fn - memoized callback function
 * 
 * @example
```ts
 // subscribe for `sample` function call
 useFn(
 wire,
 'sample',
 useCallback(value => {
    console.log(value);
  }, []),
 );

 // call `sample` function
 wire.fns.sample(5);
```
 */
export function useFn<Fns, K extends KeyOfMethods<Fns>>(
  wire: FnsWire<Fns> | null | undefined,
  name: K,
  fn: Fns[K],
) {
  useStabilityGuard(wire);
  useEffect(() => {
    return wire?.fn(name, fn);
  }, [wire, name, fn]);
}
