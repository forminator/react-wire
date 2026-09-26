import { useEffect } from 'react';
import type { KeyOfMethods } from '../utils/type-utils';
import type { FnsWire } from './fns-wire';

/**
 * 
 * subscribe for function calls
 * 
 * @param wire -
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
export function useFn<Fns extends {}, K extends KeyOfMethods<Fns>>(
  wire: FnsWire<Fns> | null | undefined,
  name: K,
  fn: Fns[K],
) {
  useEffect(() => {
    return wire?.fn(name, fn);
  }, [wire, name, fn]);
}
