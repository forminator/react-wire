import { Interferer } from './Interferer';
import { Wire } from './wire';
import { _WireImpl } from './wire.impl';

/**
 * @internal
 */
export class _SetValueInterferer<Value> extends _WireImpl<Value> {
  private interferer: Interferer<Value>;
  constructor(upLink: Wire<Value>, interferer: Interferer<Value>) {
    super(upLink);
    this.interferer = interferer;
  }

  setInterferer(interferer: Interferer<Value>) {
    this.interferer = interferer;
  }

  setValue(value: Value): void {
    const preValue = this.getValue();
    const nextValue = this.interferer(value, preValue);
    if (nextValue !== undefined && nextValue !== preValue) {
      super.setValue(nextValue);
    }
  }
}
