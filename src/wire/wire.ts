import { FnsWire } from '../fn-wire/fns-wire';
import { ReadonlyStateWire } from '../state-wire/readonly-state-wire';
import { StateWire } from '../state-wire/state-wire';

export type Wire<V, Fns extends {} = {}> = StateWire<V> & FnsWire<Fns>;
export type ReadonlyWire<V, Fns extends {} = {}> = ReadonlyStateWire<V> &
  FnsWire<Fns>;
