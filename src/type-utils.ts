export type Defined<T> = T extends undefined ? never : T;

export type MethodKeys<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];
export type Methods<T> = Pick<T, MethodKeys<T>>;
export type CB<T> = (t: T) => void;
export type StrictGuard<T extends (...args: any) => any> = [T, CB<T>];
export type StrictMethodsGuard<Fs> = {
  [P in keyof Methods<Fs>]: StrictGuard<Fs[P]>;
};
