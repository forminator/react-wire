import mitt, { Emitter } from 'mitt';
import {
  createReadonlyStateWireGuard,
  ReadonlyStateWire,
} from '../state-wire/readonly-state-wire';
import { createStateWireGuard } from '../state-wire/state-wire';
import { StateWire } from '../types';
import { Defined } from '../utils/type-utils';

type DisconnectFunction = () => void;
type ConnectFunction = () => DisconnectFunction;

export type GetWireValue = <V>(wire: ReadonlyStateWire<V>) => V;
export type SetWireValue = <V>(wire: StateWire<V>, value: Defined<V>) => void;

export interface ReadOnlySelectorOptions<V> {
  get: (options: { get: GetWireValue }) => V;
}

export interface WritableSelectorOptions<V> {
  get: (options: { get: GetWireValue }) => V;
  set: (options: { get: GetWireValue; set: SetWireValue }, value: V) => void;
}

export interface SelectorOptions<V> {
  get: (options: { get: GetWireValue }) => V;
  set?: (options: { get: GetWireValue; set: SetWireValue }, value: V) => void;
}

export function createStateSelector<V>(
  options: WritableSelectorOptions<V>,
): [StateWire<V>, ConnectFunction];
export function createStateSelector<V>(
  options: ReadOnlySelectorOptions<V>,
): [ReadonlyStateWire<V>, ConnectFunction];
export function createStateSelector<V>(
  options: SelectorOptions<V>,
): [ReadonlyStateWire<V> | StateWire<V>, ConnectFunction] {
  const key: string = 'value';
  const activeWires: {
    current: Map<ReadonlyStateWire<any>, null | (() => void)>;
  } = {
    current: new Map(),
  };
  const { get: getOption, set: setOption } = options;
  const get = <V>(wire: ReadonlyStateWire<V>) => {
    activeWires.current.set(wire, null);
    return wire.getValue();
  };
  const setGet = <V>(wire: ReadonlyStateWire<V>) => {
    return wire.getValue();
  };
  const set = <V>(wire: StateWire<V>, value: Defined<V>) => {
    wire.setValue(value);
  };
  let stateValue = getOption({ get });
  const emitter: Emitter = mitt();

  const update = () => {
    const oldActiveWires = activeWires.current;
    const oldValue = stateValue;
    const newActiveWires = new Map();
    activeWires.current = newActiveWires;
    const newValue = getOption({ get });

    oldActiveWires.forEach((unsubscribe, wire) => {
      if (unsubscribe && !newActiveWires.has(wire)) {
        unsubscribe();
      }
    });
    newActiveWires.forEach((unsubscribe, wire) => {
      const newUnsubscribe =
        oldActiveWires.get(wire) ??
        wire.subscribe(() => {
          update();
        });

      newActiveWires.set(wire, newUnsubscribe);
    });

    if (oldValue !== newValue) {
      stateValue = newValue;
      emitter.emit(key, newValue);
    }
    return () => {
      const oldActiveWires = activeWires.current;
      activeWires.current = new Map();
      oldActiveWires.forEach((unsubscribe) => {
        unsubscribe && unsubscribe();
      });
    };
  };

  const connect = () => {
    return update();
  };

  const getValue = () => {
    return stateValue;
  };

  const setValue = (value: Defined<V>) => {
    setOption && setOption({ get: setGet, set }, value);
  };

  const subscribe = (callback: (value: Defined<V>) => void) => {
    emitter.on(key, callback);
    return () => {
      emitter.off(key, callback);
    };
  };

  const selectorContext: ReadonlyStateWire<V> | StateWire<V> = setOption
    ? { getValue, subscribe, setValue, ...createStateWireGuard() }
    : { getValue, subscribe, ...createReadonlyStateWireGuard() };

  return [selectorContext, connect];
}
