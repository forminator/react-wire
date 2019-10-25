import { useEffect, useState } from 'react';
import { isInitializer } from './is-initializer';
import { Wire } from './wire';
import { _WireImpl } from './wire.impl';

export function useWire<Value>(
  upLink: Wire<Value> | null | undefined,
  initialValue?: Value | (() => Value),
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
