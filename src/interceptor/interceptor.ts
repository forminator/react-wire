import type { Defined } from '../utils/type-utils';

export type Interceptor<Value> = (
  nextValue: Defined<Value>,
  preValue: Value,
) => Value | undefined;
