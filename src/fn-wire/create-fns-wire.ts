import mitt, { Emitter } from 'mitt';
import { Fn, KeyOfMethods, Parameters } from '../utils/type-utils';
import { createFnsWireGuard, FnsWire, isFnsWire } from './fns-wire';

type DisconnectFunction = () => void;
type ConnectFunction = () => DisconnectFunction;

export interface Action<
  Fns extends {},
  K extends KeyOfMethods<Fns> = KeyOfMethods<Fns>,
> {
  type: K;
  args: Parameters<Fns[K]>;
}

export function createFnsWire<Fns extends {} = {}>(
  ctx: FnsWire<Fns>,
): [FnsWire<Fns>, ConnectFunction];
export function createFnsWire<Fns extends {} = {}>(
  ctx: Partial<FnsWire<Fns>>,
): [FnsWire<Fns>, ConnectFunction];
export function createFnsWire<Fns extends {} = {}>(
  ctx: FnsWire<Fns> | Partial<FnsWire<Fns>>,
): [FnsWire<Fns>, ConnectFunction] {
  const emitter: Emitter = mitt();
  const upLink: FnsWire<Fns> | null = isFnsWire<Fns>(ctx) ? ctx : null;

  const handler: ProxyHandler<{}> = {
    get: function (target, prop: string) {
      return (...args: any) => {
        if (upLink) {
          (upLink.fns as any)[prop](...args);
        } else {
          emitter.emit(prop, { type: prop, args });
        }
      };
    },
  };
  const fns = new Proxy({}, handler) as any;

  const fn = <K extends KeyOfMethods<Fns>>(
    name: K,
    fn: Fns[K],
  ): (() => void) => {
    if (upLink) {
      return upLink.fn(name, fn);
    } else {
      const handle = (action: Action<Fns>) => {
        (fn as Fn)(...action.args);
      };
      emitter.on(name as string, handle);
      return () => {
        emitter.off(name as string, handle);
      };
    }
  };

  const fnsContext = {
    fn,
    fns,
  };
  const connect = () => {
    return () => {};
  };
  return [{ ...fnsContext, ...createFnsWireGuard() }, connect];
}
