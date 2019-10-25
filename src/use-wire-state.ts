import {
  Dispatch,
  SetStateAction,
  useCallback,
  useDebugValue,
  useEffect,
  useState,
} from 'react';
import { isSetStateAction } from './is-set-state-action';
import { Subscribable } from './subscribable';
import { useWire } from './use-wire';

export function useWireState<Value>(
  wire: Subscribable<Value> | null | undefined,
): [Value | undefined, Dispatch<SetStateAction<Value>>];
export function useWireState<Value>(
  wire: Subscribable<Value> | null | undefined,
  initialValue: Value | (() => Value),
): [Value, Dispatch<SetStateAction<Value>>];
export function useWireState<Value>(
  wire: Subscribable<Value> | null | undefined,
  initialValue?: undefined | Value | (() => Value),
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
