import { FnsWire } from '../fn-wire/fns-wire';
import { StateWire } from '../state-wire/state-wire';

export type Wire<V, Fns> = StateWire<V> & FnsWire<Fns>;
