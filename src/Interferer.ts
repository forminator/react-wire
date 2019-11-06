export type Interferer<Value> = (
  nextValue: Value,
  preValue: Value | undefined,
) => Value | undefined;
