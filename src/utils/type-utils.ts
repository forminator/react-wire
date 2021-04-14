export type Defined<T> = T extends undefined ? never : T;

/**
 * isDefined check if the value is undefined or not.
 * it helps with typescript generic types.
 * @param value
 */
export const isDefined = <V>(value: V | undefined): value is Defined<V> =>
  value !== undefined;

export declare type IsNever<T> = [T] extends [never] ? true : false;
export type NonNever<T> = IsNever<T> extends true ? any : T;

export type MethodKeys<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];
export type Methods<T> = Pick<T, MethodKeys<T>>;
export type KeyOfMethods<T> = NonNever<keyof Methods<T>>;
export type CB<T> = (t: T) => void;
export type StrictGuard<T> = [T, CB<T>];
export type CovarianceGuard<T> = [T, unknown];
export type StrictMethodsGuard<Fns> = {
  [P in keyof Methods<Fns>]: StrictGuard<Fns[P]>;
};
