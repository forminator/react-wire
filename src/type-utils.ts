export type Defined<T> = T extends undefined ? never : T;

export declare type IsNever<T> = [T] extends [never] ? true : false;
export type NonNever<T> = IsNever<T> extends true ? any : T;

export type MethodKeys<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];
export type Methods<T> = Pick<T, MethodKeys<T>>;
export type KeyOfMethods<T> = NonNever<keyof Methods<T>>;
export type CB<T> = (t: T) => void;
export type StrictGuard<T extends (...args: any) => any> = [T, CB<T>];
export type StrictMethodsGuard<Fs> = {
  [P in keyof Methods<Fs>]: StrictGuard<Fs[P]>;
};
