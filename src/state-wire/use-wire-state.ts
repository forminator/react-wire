import {
  Dispatch,
  SetStateAction,
  useCallback,
  useDebugValue,
  useEffect,
  useState,
} from 'react';
import { InitializerOrValue } from '../utils/is-initializer';
import { isSetStateAction } from '../utils/is-set-state-action';
import { Defined, isDefined } from '../utils/type-utils';
import { StateWire } from './state-wire';
import { useStateWire } from './use-state-wire';

type valueAndAction<V> = [V, Dispatch<SetStateAction<Defined<V>>>];

export function useWireState<V>(upLink: StateWire<V>): valueAndAction<V>;
export function useWireState<V>(
  wire: StateWire<V | undefined> | null | undefined,
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
  const valueToReturn = innerWire.getValue();
  const [stateValue, setStateValue] = useState(() => innerWire.getValue());
  useDebugValue(valueToReturn);
  useEffect(() => {
    const wireValue = innerWire.getValue();
    if (isDefined(wireValue) && wireValue !== stateValue) {
      setStateValue(wireValue);
    }
    return innerWire.subscribe(value => {
      setStateValue(value);
    });
    // `stateValue` variable only used as initial value
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [innerWire]);

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
