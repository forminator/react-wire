// read more about doc comment syntax in https://api-extractor.com/pages/tsdoc/doc_comment_syntax/

/**
 * connect react components with wire
 *
 * @packageDocumentation
 */

export { useWire } from './wire/use-wire';
export { useWireState } from './state-wire/use-wire-state';
export { useWireValue } from './state-wire/use-wire-value';
export { useInterceptor } from './interceptor/use-interceptor';
export { useFn } from './fn-wire/use-fn';
export { createWire } from './wire/create-wire';
export { createSelector } from './selector/create-selector';
export { useSelector } from './selector/use-selector';
export { useSubscribe } from './state-wire/use-subscribe';

export { isDefined } from './utils/type-utils';
export { getLinkIds, getWireId } from './utils/wire-id';

export type { StateWire } from './state-wire/state-wire';
export type {
  ReadonlyStateWire,
  WireState,
} from './state-wire/readonly-state-wire';
export type { FnsWire, WireFns } from './fn-wire/fns-wire';
export type { Wire, ReadonlyWire } from './wire/wire';
export type { Interceptor } from './interceptor/interceptor';
export type {
  ReadOnlySelectorOptions,
  WritableSelectorOptions,
} from './state-selector/create-state-selector';

export type { Defined } from './utils/type-utils';
export type { WireId, LinkIds } from './utils/wire-id';
