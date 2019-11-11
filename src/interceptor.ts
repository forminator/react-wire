export type Interceptor<Value> = (
  nextValue: Value,
  preValue: Value | undefined,
) => Value | undefined;
