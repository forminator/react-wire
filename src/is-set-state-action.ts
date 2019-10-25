import { SetStateAction } from 'react';

export function isSetStateAction<S>(
  action: SetStateAction<S>,
): action is (prevState: S) => S {
  return typeof action === 'function';
}
