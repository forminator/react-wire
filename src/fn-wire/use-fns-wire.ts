import { useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';
import { createFnsWire } from './create-fns-wire';
import { FnsWire } from './fns-wire';

const create = <Fns extends {}>(upLink: FnsWire<Fns> | null | undefined) => {
  return createFnsWire(upLink || {});
};

export function useFnsWire<Fns extends {} = {}>(
  upLink: FnsWire<Fns> | null | undefined,
): FnsWire<Fns> {
  const [[wire, connect], set] = useState(() => create(upLink));
  const lastUpLinkRef = useRef(upLink);
  useIsomorphicLayoutEffect(() => {
    if (lastUpLinkRef.current !== upLink) {
      lastUpLinkRef.current = upLink;
      set(create(upLink));
    }
  }, [upLink]);
  useEffect(() => {
    return connect();
  }, [connect]);
  return wire;
}
