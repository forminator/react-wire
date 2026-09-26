export const createDeferred = <V>() => {
  let resolve!: (value: V | PromiseLike<V>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<V>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
};

export const createAsyncResource = <K, V>() => {
  const entries = new Map<K, ReturnType<typeof createDeferred<V>>>();

  const getEntry = (key: K) => {
    let entry = entries.get(key);
    if (!entry) {
      entry = createDeferred<V>();
      entries.set(key, entry);
    }
    return entry;
  };

  return {
    get: (key: K) => getEntry(key).promise,
    reject: (key: K, reason?: unknown) => getEntry(key).reject(reason),
    resolve: (key: K, value: V) => getEntry(key).resolve(value),
  };
};
