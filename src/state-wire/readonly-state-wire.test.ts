import {
  createReadonlyStateWireGuard,
  isReadonlyStateWire,
} from './readonly-state-wire';
import { createStateWireGuard, isWritableStateWire } from './state-wire';
describe('createReadonlyStateWireGuard', () => {
  it('should return readonly state wire ', () => {
    const wire = createReadonlyStateWireGuard();
    expect(isReadonlyStateWire(wire)).toBe(true);
  });
  it('should not be writable state wire ', () => {
    const wire = createReadonlyStateWireGuard();
    expect(isWritableStateWire(wire)).toBe(false);
  });
});

describe('createStateWireGuard', () => {
  it('should return readonly state wire ', () => {
    const wire = createStateWireGuard();
    expect(isReadonlyStateWire(wire)).toBe(true);
  });
  it('should return writable state wire ', () => {
    const wire = createStateWireGuard();
    expect(isWritableStateWire(wire)).toBe(true);
  });
});
