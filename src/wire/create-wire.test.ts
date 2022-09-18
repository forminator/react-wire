import { describe, expect, it, vi } from 'vitest';
import { createWire } from './create-wire';

describe('create-wire', () => {
  it('should return wire', () => {
    const wire = createWire(4);

    expect(wire.getValue()).toBe(4);
  });
  it('should change value', () => {
    const wire = createWire(4);
    wire.setValue(3);
    expect(wire.getValue()).toBe(3);
  });
  it('should call subscribed value', () => {
    const fn = vi.fn();
    const wire = createWire(4);
    wire.subscribe((value) => {
      fn(value);
    });
    wire.setValue(3);
    expect(fn).toBeCalledWith(3);
    expect(fn).toBeCalledTimes(1);
  });
});
