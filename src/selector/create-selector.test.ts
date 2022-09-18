import { describe, expect, it, vi } from 'vitest';
import { createWire } from '../wire/create-wire';
import { createSelector } from './create-selector';

describe('create-wire', () => {
  it('should return wire', () => {
    const wire = createWire(4);
    const selector = createSelector({
      get: ({ get }) => get(wire) * 2,
    });
    expect(selector.getValue()).toBe(8);
  });
  it('should change value', () => {
    const wire = createWire(4);
    const selector = createSelector({
      get: ({ get }) => get(wire) * 2,
    });
    wire.setValue(3);
    expect(selector.getValue()).toBe(6);
  });
  it('should update wire value', () => {
    const wire = createWire(4);
    const selector = createSelector({
      get: ({ get }) => get(wire) * 2,
      set: ({ set }, value: number) => set(wire, value / 2),
    });
    selector.setValue(6);
    expect(wire.getValue()).toBe(3);
  });
  it('should call subscribed value', () => {
    const fn = vi.fn();
    const wire = createWire(4);
    const selector = createSelector({
      get: ({ get }) => get(wire) * 2,
    });
    selector.subscribe((value) => {
      fn(value);
    });
    wire.setValue(3);
    expect(fn).toBeCalledWith(6);
  });
});
