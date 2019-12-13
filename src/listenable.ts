import { KeyOfMethods, StrictMethodsGuard } from './type-utils';

export interface Action<Fs, K extends KeyOfMethods<Fs> = KeyOfMethods<Fs>> {
  type: K;
  args: Parameters<Fs[K]>;
}

export type ActionListener<Fs> = (type: string, action: Action<Fs>) => void;
export interface Listenable<Fs> {
  listen(type: '*', fn: ActionListener<Partial<Fs>>): () => void;
  listen<K extends KeyOfMethods<Fs>>(type: K, fn: Fs[K]): () => void;
  fire<K extends KeyOfMethods<Fs>>(action: Action<Fs, K>): void;

  /**
   * @internal
   * Covariance hack:
   * never use this variable.
   * don't remove space at the start
   */
  ' Listenable': StrictMethodsGuard<Fs>; // Covariance hack
}
