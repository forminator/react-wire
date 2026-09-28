import type { FnsWire } from '../fn-wire/fns-wire';
import type { ReadonlyStateWire } from '../state-wire/readonly-state-wire';
import type { StateWire } from '../state-wire/state-wire';

export type Wire<V, Fns extends {} = {}> = StateWire<V> & FnsWire<Fns>;
export type ReadonlyWire<V, Fns extends {} = {}> = ReadonlyStateWire<V> &
  FnsWire<Fns>;
