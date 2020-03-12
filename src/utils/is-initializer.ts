export type Initializer<V> = () => V;
export type InitializerOrValue<V> = V | (() => V);
export function isInitializer<V>(
  initialValue: InitializerOrValue<V>,
): initialValue is Initializer<V> {
  return typeof initialValue === 'function';
}
