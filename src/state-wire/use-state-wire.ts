import { useEffect, useRef, useState } from 'react';
import { InitializerOrValue, isInitializer } from '../utils/is-initializer';
import { isDefined } from '../utils/type-utils';
import {
  isBrowser,
  useIsomorphicLayoutEffect,
} from '../utils/use-isomorphic-layout-effect';
import { createStateWire } from './create-state-wire';
import { StateWire } from './state-wire';

const create = <V>(
  upLink: StateWire<V | undefined> | null | undefined,
  initialValue: InitializerOrValue<V | undefined>,
) => {
  return createStateWire<V>(
    upLink || {},
    isDefined(initialValue)
      ? isInitializer<V | undefined>(initialValue)
        ? initialValue()
        : initialValue
      : undefined,
  );
};

export function useStateWire<V>(upLink: StateWire<V>): StateWire<V>;
export function useStateWire<V>(
  upLink: StateWire<V | undefined> | null | undefined,
  initialValue: InitializerOrValue<V>,
): StateWire<V>;
export function useStateWire<V>(
  upLink: StateWire<V> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): StateWire<V | undefined>;
export function useStateWire<V>(
  upLink: StateWire<V | undefined> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): StateWire<V | undefined> | StateWire<V> {
  const [[wire, connect], set] = useState(() => create(upLink, initialValue));
  const lastUpLinkRef = useRef(upLink);

  if (
    !isBrowser &&
    upLink &&
    upLink.getValue() === undefined &&
    wire.getValue() !== undefined
  ) {
    console.error(
      'upLink value is undefined. uplink without value is not supported in server side rendering',
    );
  }

  useIsomorphicLayoutEffect(() => {
    if (lastUpLinkRef.current !== upLink) {
      lastUpLinkRef.current = upLink;
      set(create(upLink, wire.getValue()));
    }
  }, [upLink, wire]);
  useEffect(() => {
    return connect();
  }, [connect]);

  return wire;
}
