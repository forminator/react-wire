import { WithFns } from './with-fns';
import { Listenable } from './listenable';
import { Subscribable } from './subscribable';

export type Wire<Value, Fs = {}> = Subscribable<Value> &
  WithFns<Fs> &
  Listenable<Fs>;
