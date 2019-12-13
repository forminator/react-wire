import mitt, { Emitter } from 'mitt';
import { batchedUpdates } from './batched-updates';
import { Action, ActionListener } from './listenable';
import { KeyOfMethods, StrictMethodsGuard } from './type-utils';

import { Wire } from './wire';
import { Fns } from './with-fns';

const fnsKey = (type: string | number | symbol) => 'action:' + type.toString();

/**
 * @internal
 */
export class _WireImpl<Value, Fs = {}> implements Wire<Value, Fs> {
  private key: string = 'value';
  private value: Value | undefined;
  private readonly emitter: Emitter = mitt();
  private upLink: Wire<Value, Fs> | null = null;
  private _disconnect: (() => void) | null = null;
  private readonly fnsEmitter: Emitter = mitt();
  public fns = this._makeFns();

  constructor(
    upLink: Wire<Value, Fs> | null | undefined,
    initialValue?: Value | undefined,
  ) {
    this.value = initialValue;
    if (upLink) {
      this.upLink = upLink;
      const value = upLink.getValue();
      if (value !== undefined) {
        this.value = value;
      }
      this._disconnect = () => {
        this._disconnect = null;
        this.upLink = null;
      };
    }
  }

  connect(upLink: Wire<Value, Fs>) {
    this.upLink = upLink;
    const onValue = (value: Value) => {
      this._setValue(value);
    };

    const value = upLink.getValue();
    if (value === undefined) {
      if (this.value !== undefined) {
        upLink.setValue(this.value);
      }
    } else {
      if (value !== this.value) {
        this._setValue(value);
      }
    }

    const unsubscribe = upLink.subscribe(onValue);

    const handle = (type: string, action: Action<Fs>) => {
      this._fire(action);
    };

    const dispose = upLink.listen('*', handle);

    this._disconnect = () => {
      this._disconnect = null;
      dispose();
      unsubscribe();
      this.upLink = null;
    };
    return this._disconnect;
  }

  disconnect() {
    if (this._disconnect) {
      this._disconnect();
    }
  }

  private _getValue(defaultValue?: Value): Value | undefined {
    return this.value === undefined ? defaultValue : this.value;
  }

  getValue(): Value | undefined;
  getValue(defaultValue: Value): Value;
  getValue(defaultValue?: Value): Value | undefined;
  getValue(defaultValue?: Value): Value | undefined {
    if (this.upLink) {
      return this.upLink.getValue(defaultValue);
    } else {
      return this._getValue(defaultValue);
    }
  }

  private _setValue(value: Value): void {
    this.value = value;
    batchedUpdates(() => {
      this.emitter.emit(this.key, value);
    });
  }
  setValue(value: Value): void {
    if (this.upLink) {
      this.upLink.setValue(value);
    } else {
      this._setValue(value);
    }
  }

  subscribe(callback: (value: Value) => void): () => void {
    const handler = (value: Value) => {
      callback(value);
    };
    this.emitter.on(this.key, handler);
    return () => {
      this.emitter.off(this.key, handler);
    };
  }

  fn<K extends KeyOfMethods<Fs>>(name: K, fn: Fs[K]): () => void {
    if (name === '*') {
      throw new Error("the name parameter can't be a star (*) string");
    }
    return this.listen(name, fn);
  }

  listen(type: '*', fn: ActionListener<Fs>): () => void;
  listen<K extends KeyOfMethods<Fs>>(type: K, fn: Fs[K]): () => void;
  listen<K extends KeyOfMethods<Fs>>(
    type: K | '*',
    fn: Fs[K] | ActionListener<Fs>,
  ): () => void {
    if (type === '*') {
      const handler = (type?: string, action?: Action<Fs>) => {
        if (type !== undefined && action) {
          (fn as ActionListener<Fs>)(type, action);
        }
      };
      this.fnsEmitter.on('*', handler);
      return () => {
        this.fnsEmitter.off('*', handler);
      };
    } else {
      const handler = (action: Action<Fs, K>) => {
        (fn as Fs[K])(...action.args);
      };
      this.fnsEmitter.on(fnsKey(type), handler);
      return () => {
        this.fnsEmitter.off(fnsKey(type), handler);
      };
    }
  }

  private _fire(action: Action<Fs>) {
    const { type } = action;
    batchedUpdates(() => {
      this.fnsEmitter.emit(fnsKey(type), action);
    });
  }

  private _makeFns(): Fns<Fs> {
    const ctx = this;
    const handler: ProxyHandler<{}> = {
      get: function(target, prop: KeyOfMethods<Fs>) {
        return (...args: any) =>
          ctx.fire({
            type: prop,
            args,
          });
      },
    };
    return new Proxy({}, handler) as any;
  }

  fire(action: Action<Fs>): void {
    if (this.upLink) {
      this.upLink.fire(action);
    } else {
      this._fire(action);
    }
  }
  // Covariance hack:
  // never use this variable.
  // don't remove space at the start
  ' Listenable': StrictMethodsGuard<Fs>;
}
