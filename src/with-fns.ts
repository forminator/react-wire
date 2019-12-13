import { KeyOfMethods, Methods } from './type-utils';

export interface WithFns<Fs extends {}> {
  fn: <K extends KeyOfMethods<Fs>>(name: K, value: Fs[K]) => () => void;
  fns: Methods<Fs>;
}

export type Fns<Fs extends {}> = WithFns<Fs>['fns'];
