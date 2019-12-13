import { useEffect } from 'react';
import { KeyOfMethods } from './type-utils';
import { Wire } from './wire';

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
export function useFn<Fs, K extends KeyOfMethods<Fs>>(
  wire: Wire<any, Fs>,
  name: K,
  fn: Fs[K],
) {
  useEffect(() => {
    return wire.fn(name, fn);
  }, [wire, name, fn]);
}
