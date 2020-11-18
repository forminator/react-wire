import { useEffect, useRef, useState } from 'react';
import { createFnsWire } from './create-fns-wire';
import { FnsWire } from './fns-wire';

const create = <Fns>(upLink: FnsWire<Fns> | null | undefined) => {
  return createFnsWire(upLink || {});
};

export function useFnsWire<Fns = {}>(
  upLink: FnsWire<Fns> | null | undefined,
): FnsWire<Fns> {
  const [[wire, connect], set] = useState(() => create(upLink));
  const lastUpLinkRef = useRef(upLink);
  if (lastUpLinkRef.current !== upLink) {
    lastUpLinkRef.current = upLink;
    set(create(upLink));
  }
  useEffect(() => {
    return connect();
  }, [connect]);
  return wire;
}
