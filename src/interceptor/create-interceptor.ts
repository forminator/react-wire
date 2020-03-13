import { StateWire } from '../state-wire/state-wire';
import { Defined, isDefined } from '../utils/type-utils';
import { Interceptor } from './interceptor';

export function createInterceptor<V, C extends StateWire<V> = StateWire<V>>(
  ctx: C,
  initialInterceptor: Interceptor<V>,
): [C, (i: Interceptor<V>) => void] {
  let interceptor = initialInterceptor;
  const setInterceptor = (newInterceptor: Interceptor<V>) => {
    interceptor = newInterceptor;
  };
  const setValue = (value: Defined<V>) => {
    const preValue = ctx.getValue();
    const nextValue = interceptor(value, preValue);
    if (isDefined(nextValue)) {
      ctx.setValue(nextValue);
    }
  };
  return [{ ...ctx, setValue }, setInterceptor];
}
