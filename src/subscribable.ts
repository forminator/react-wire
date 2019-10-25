export interface Subscribable<V> {
  getValue(): V | undefined;
  getValue(defaultValue: V): V;
  getValue(defaultValue?: V): V | undefined;
  setValue(value: V): void;
  subscribe(callback: (value: V) => void): () => void;
}
