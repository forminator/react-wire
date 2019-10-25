export function isInitializer<V>(
  initialValue: V | (() => V),
): initialValue is () => V {
  return typeof initialValue === 'function';
}
