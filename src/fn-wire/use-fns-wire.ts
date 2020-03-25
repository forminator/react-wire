import { useEffect, useState } from 'react';
import { createFnsWire } from './create-fns-wire';
import { FnsWire } from './fns-wire';

export function useFnsWire<Fns = {}>(
  upLink: FnsWire<Fns> | null | undefined,
): FnsWire<Fns> {
  const [[wire, connect]] = useState(() => createFnsWire(upLink || {}));
  useEffect(() => {
    return connect();
  }, [connect]);
  return wire;
}
