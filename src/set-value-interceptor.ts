import { Interceptor } from './interceptor';
import { Wire } from './wire';
import { _WireImpl } from './wire.impl';

/**
 * @internal
 */
export class _SetValueInterceptor<Value> extends _WireImpl<Value> {
  private interceptor: Interceptor<Value>;
  constructor(upLink: Wire<Value>, interceptor: Interceptor<Value>) {
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
