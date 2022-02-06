export function memoize<F extends Function>(fn: F): F {
  let lastArgs: any[] | undefined = undefined;
  let lastResult: unknown = undefined;
  return function (...args: any[]): any {
    if (
      lastArgs !== undefined &&
      lastArgs.length === args.length &&
      lastArgs.every((arg, i) => arg === args[i])
    ) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = fn(...args);
    return lastResult;
  } as any;
}
