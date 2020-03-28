import {
  useFn,
  useInterceptor,
  useWire,
  useWireState,
  useWireValue,
} from './index';

describe('index file', () => {
  it('should exports correctly', () => {
    expect(useWire).toBeDefined();
    expect(useWireValue).toBeDefined();
    expect(useWireState).toBeDefined();
    expect(useInterceptor).toBeDefined();
    expect(useFn).toBeDefined();
  });
});
