/**
 *
 *
 * @typeParam V - the type of the subscribable
 */
export interface Subscribable<V> {
  /**
   * get current value
   * @returns current value
   */
  getValue(): V | undefined;
  /**
   * get current value
   * @returns current value
   */
  getValue(defaultValue: V): V;
  /**
   * get current value
   * @returns current value
   */
  getValue(defaultValue?: V): V | undefined;
  /**
   * set value
   * @param value
   */
  setValue(value: V): void;
  /**
   * subscribe for value change
   * @param callback
   * @returns unsubscribe function
   */
  subscribe(callback: (value: V) => void): () => void;
}
