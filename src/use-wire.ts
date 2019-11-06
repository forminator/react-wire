import { useEffect, useState } from 'react';
import { isInitializer } from './is-initializer';
import { Wire } from './wire';
import { _WireImpl } from './wire.impl';

/**
 *
 *
 * creates and returns a new wire. 
 * 
 * @typeParam Value - the type of the value of wire
 * 
 * @param upLink - the up-link wire to be connected to and sync value with
 * @param initialValue - initial value or initializer function
 * @returns new wire
 * 
 * @remarks
 * if up-link wire param provided, the newly created wire will be connected to up-link and they have the same value
 * 
 * if `upLink` param provided and up-link wire has a value, this wire respect up-link value and ignore its own initial value.
 * 
 * if `upLink` param provided and up-link wire hasn't a value (has `undefined` value) and this wire has a value, up-link value will be updated
 * 
 * please always pass same wire as up-link and avoid changing up-link wire, it can cause strange behavior and bad intermediate values

 *
 */
export function useWire<Value>(
  upLink: Wire<Value> | null | undefined,
  initialValue?: Value | (() => Value | undefined),
): Wire<Value> {
  const [wire] = useState(
    () =>
      new _WireImpl(
        upLink,
        isInitializer<Value | undefined>(initialValue)
          ? initialValue()
          : initialValue,
      ),
  );

  useEffect(() => {
    if (upLink) {
      return wire.connect(upLink);
    }
  }, [wire, upLink]); // wire always is equal, only upLink value can be changed

  return wire;
}
