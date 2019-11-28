import { Interceptor } from './interceptor';
import { Wire } from './wire';
import { _WireImpl } from './wire.impl';

/**
 * @internal
 */
export class _SetValueInterceptor<Value, Fs> extends _WireImpl<Value, Fs> {
  private interceptor: Interceptor<Value>;
  constructor(upLink: Wire<Value, Fs>, interceptor: Interceptor<Value>) {
    super(upLink);
    this.interceptor = interceptor;
  }

  setInterceptor(interceptor: Interceptor<Value>) {
    this.interceptor = interceptor;
  }

  setValue(value: Value): void {
    const preValue = this.getValue();
    const nextValue = this.interceptor(value, preValue);
    if (nextValue !== undefined && nextValue !== preValue) {
      super.setValue(nextValue);
    }
  }
}
