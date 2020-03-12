import {
  Dispatch,
  SetStateAction,
  useCallback,
  useDebugValue,
  useEffect,
  useState,
} from 'react';
import { isSetStateAction } from './utils/is-set-state-action';
import { Defined } from './utils/type-utils';
import { useWire } from './use-wire';
import { Wire } from './wire';

/**
 * same as react useState but synced with wire.
 *
 * @param wire - the wire to be connected to and sync value with
 * @param initialValue - initial value or initializer function
 *
 * @returns state and setState.
 *
 * @remarks
 * if wire is null, it should behave like `useState`
 *
 * if `wire` param provided and wire has a value, the state respect wire value and ignore its own initial value.
 *
 * if `wire` param provided and wire hasn't a value (has `undefined` value), wire value will be updated
 *
 * please always pass same wire and avoid changing wire, it can cause strange behavior and bad intermediate values
 *
 */
export function useWireState<Value>(
  wire: Wire<Value, any> | null | undefined,
  initialValue: Value | (() => Value),
): [Value, Dispatch<SetStateAction<Defined<Value>>>];

/**
 * same as react useState but synced with wire.
 *
 * @param wire - the wire to be connected to and sync value with
 * @param initialValue - initial value or initializer function
 * @returns state and setState.
 *
 * @remarks
 * if wire is null, it should behave like `useState`
 *
 * if `wire` param provided and wire has a value, the state respect wire value and ignore its own initial value.
 *
 * if `wire` param provided and wire hasn't a value (has `undefined` value), wire value will be updated
 *
 * please always pass same wire and avoid changing wire, it can cause strange behavior and bad intermediate values
 *
 */
export function useWireState<Value>(
  wire: Wire<Value> | null | undefined,
  initialValue?: undefined | Value | (() => Value | undefined),
): [Value | undefined, Dispatch<SetStateAction<Value>>];
export function useWireState<Value>(
  wire: Wire<Value> | null | undefined,
  initialValue?: undefined | Value | (() => Value | undefined),
): [Value | undefined, Dispatch<SetStateAction<Value>>] {
  const innerWire = useWire<Value>(wire, initialValue);
  const [stateValue, setStateValue] = useState<Value | undefined>(() =>
    innerWire.getValue(),
  );
  useDebugValue(stateValue);
  useEffect(() => {
    const subscribableValue = innerWire.getValue();
    if (subscribableValue !== undefined && subscribableValue !== stateValue) {
      setStateValue(subscribableValue);
    } else if (stateValue !== undefined) {
      innerWire.setValue(stateValue);
    }
    return innerWire.subscribe(value => {
      setStateValue(value);
    });
    // `stateValue` variable only used as initial value
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [innerWire]);

  const setValue = useCallback(
    (value: SetStateAction<Value>) => {
      let nextValue = undefined;
      if (isSetStateAction(value)) {
        const preValue = innerWire.getValue();
        if (preValue !== undefined) {
          nextValue = value(preValue);
        }
      } else {
        nextValue = value;
      }
      if (nextValue !== undefined) {
        innerWire.setValue(nextValue);
      }
    },
    [innerWire],
  );

  return [stateValue, setValue];
}
