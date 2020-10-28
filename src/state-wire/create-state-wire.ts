import mitt, { Emitter } from 'mitt';
import { Defined, isDefined } from '../utils/type-utils';
import {
  createStateWireGuard,
  isWritableStateWire,
  StateWire,
} from './state-wire';

type DisconnectFunction = () => void;
type ConnectFunction = () => DisconnectFunction;

export function createStateWire<V>(
  ctx: StateWire<V>,
  initialValue?: V | undefined,
): [StateWire<V>, ConnectFunction];
export function createStateWire<V>(
  ctx: Partial<StateWire<V>>,
  initialValue: V,
): [StateWire<V>, ConnectFunction];
export function createStateWire<V>(
  ctx: Partial<StateWire<V | undefined>>,
  initialValue?: V | undefined,
): [StateWire<V | undefined>, ConnectFunction];
export function createStateWire<V>(
  ctx: Partial<StateWire<V | undefined>>,
  initialValue?: V | undefined,
): [StateWire<V> | StateWire<V | undefined>, ConnectFunction] {
  const key: string = 'value';
  let stateValue = initialValue;
  const emitter: Emitter = mitt();
  const upLink: StateWire<V | undefined> | null = isWritableStateWire<V>(ctx)
    ? ctx
    : null;

  const getValue = () => {
    const upLinkValue = upLink ? upLink.getValue() : undefined;
    return upLinkValue === undefined ? stateValue : upLinkValue;
  };

  const setValue = (value: Defined<V>) => {
    if (upLink) {
      upLink.setValue(value);
    } else {
      if (stateValue !== value) {
        stateValue = value;
        emitter.emit(key, stateValue);
      }
    }
  };

  const subscribe = (callback: (value: Defined<V>) => void) => {
    emitter.on(key, callback);
    return () => {
      emitter.off(key, callback);
    };
  };

  const connect = () => {
    if (upLink) {
      const upLinkValue = upLink.getValue();

      if (isDefined(upLinkValue)) {
        stateValue = upLinkValue;
      } else if (isDefined(stateValue)) {
        upLink.setValue(stateValue);
      }

      return upLink.subscribe((value: Defined<V>) => {
        stateValue = value;
        emitter.emit(key, value);
      });
    }
    return () => {};
  };

  const stateContext = {
    getValue,
    setValue,
    subscribe,
  };

  return [{ ...stateContext, ...createStateWireGuard() }, connect];
}
