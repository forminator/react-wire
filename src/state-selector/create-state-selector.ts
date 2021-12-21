import mitt, { Emitter } from 'mitt';
import {
  createReadonlyStateWireGuard,
  ReadonlyStateWire,
} from '../state-wire/readonly-state-wire';
import { createStateWireGuard } from '../state-wire/state-wire';
import { StateWire } from '../types';
import { Defined } from '../utils/type-utils';

type ReconnectFunction<O> = (options?: O) => void;
type ConnectFunction<O> = () => ReconnectFunction<O>;

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

type UnsubscribeMap = Map<ReadonlyStateWire<any>, null | (() => void)>;
type ValueMap = Map<ReadonlyStateWire<any>, unknown>;

const resubscribe = (
  oldActiveWires: UnsubscribeMap,
  newActiveWires: UnsubscribeMap,
  update?: () => void,
) => {
  oldActiveWires.forEach((unsubscribe, wire) => {
    if (unsubscribe && !newActiveWires.has(wire)) {
      unsubscribe();
      oldActiveWires.set(wire, null);
    }
  });
  newActiveWires.forEach((unsubscribe, wire) => {
    const newUnsubscribe =
      oldActiveWires.get(wire) ??
      wire.subscribe(() => {
        update && update();
      });

    newActiveWires.set(wire, newUnsubscribe);
  });
};

const valuesChanged = (values: ValueMap) => {
  let changed = false;
  values.forEach((value, wire) => {
    if (value !== wire.getValue()) {
      changed = true;
    }
  });
  return changed;
};

export function createStateSelector<V>(
  options: WritableSelectorOptions<V>,
): [StateWire<V>, ConnectFunction<WritableSelectorOptions<V>>];
export function createStateSelector<V>(
  options: ReadOnlySelectorOptions<V>,
): [ReadonlyStateWire<V>, ConnectFunction<ReadOnlySelectorOptions<V>>];
export function createStateSelector<V>(
  options: SelectorOptions<V>,
):
  | [ReadonlyStateWire<V>, ConnectFunction<ReadOnlySelectorOptions<V>>]
  | [StateWire<V>, ConnectFunction<WritableSelectorOptions<V>>] {
  const key: string = 'value';
  const activeWires: { current: UnsubscribeMap } = { current: new Map() };
  const activeValues: { current: ValueMap } = { current: new Map() };
  let { get: getOption, set: setOption } = options;

  const get = <V>(wire: ReadonlyStateWire<V>) => {
    activeWires.current.set(wire, null);
    const value = wire.getValue();
    activeValues.current.set(wire, value);
    return value;
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
    const newActiveWires = (activeWires.current = new Map());
    activeValues.current = new Map();

    const oldValue = stateValue;
    const newValue = getOption({ get });

    resubscribe(oldActiveWires, newActiveWires, update);

    if (oldValue !== newValue) {
      stateValue = newValue;
      emitter.emit(key, newValue);
    }
  };

  const disconnect = () => {
    resubscribe(activeWires.current, new Map());
  };

  const connect = () => {
    if (valuesChanged(activeValues.current)) {
      update();
    } else {
      resubscribe(new Map(), activeWires.current, update);
    }
    return (options?: SelectorOptions<V>) => {
      if (options) {
        getOption = options.get;
        setOption = options.set;
        update();
      } else {
        disconnect();
      }
    };
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
