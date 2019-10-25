import mitt, { Emitter } from 'mitt';
import ReactDOM from 'react-dom';
import { Wire } from './wire';

/**
 * @internal
 */
export class _WireImpl<Value> implements Wire<Value> {
  private key: string = 'value';
  private value: Value | undefined;
  private readonly emitter: Emitter = mitt();
  private upLink: Wire<Value> | null = null;
  private _disconnect: (() => void) | null = null;

  constructor(
    upLink: Wire<Value> | null | undefined,
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

  connect(upLink: Wire<Value>) {
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

    this._disconnect = () => {
      this._disconnect = null;
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
    ReactDOM.unstable_batchedUpdates(() => {
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
}
