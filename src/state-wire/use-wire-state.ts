import { Dispatch, SetStateAction, useCallback, useDebugValue } from 'react';
import { InitializerOrValue } from '../utils/is-initializer';
import { isSetStateAction } from '../utils/is-set-state-action';
import { Defined, isDefined } from '../utils/type-utils';
import { StateWire } from './state-wire';
import { useStateWire } from './use-state-wire';
import { useWireValue } from './use-wire-value';

type valueAndAction<V> = [V, Dispatch<SetStateAction<Defined<V>>>];

export function useWireState<V>(upLink: StateWire<V>): valueAndAction<V>;
export function useWireState<V>(
  wire: StateWire<V | undefined> | null | undefined,
  initialValue: InitializerOrValue<V>,
): valueAndAction<V>;
export function useWireState<V>(
  wire: StateWire<V> | null | undefined,
  initialValue: InitializerOrValue<V>,
): valueAndAction<V>;
export function useWireState<V>(
  wire: StateWire<V> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): valueAndAction<V | undefined>;
export function useWireState<V>(
  wire: StateWire<V | undefined> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): valueAndAction<V | undefined> | valueAndAction<V> {
  const innerWire = useStateWire(wire, initialValue);
  const valueToReturn = useWireValue(innerWire);
  useDebugValue(valueToReturn);

  const setValue = useCallback(
    (value: SetStateAction<Defined<V>>) => {
      let nextValue = undefined;
      if (isSetStateAction(value)) {
        const preValue = innerWire.getValue();
        if (isDefined(preValue)) {
          nextValue = value(preValue);
        }
      } else {
        nextValue = value;
      }
      if (isDefined(nextValue)) {
        innerWire.setValue(nextValue);
      }
    },
    [innerWire],
  );

  return [valueToReturn, setValue];
}
