import {
  createSelector,
  createWire,
  isDefined,
  useFn,
  useInterceptor,
  useSelector,
  useSubscribe,
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
    expect(createWire).toBeDefined();
    expect(createSelector).toBeDefined();
    expect(useSelector).toBeDefined();
    expect(useSubscribe).toBeDefined();
    expect(isDefined).toBeDefined();
  });
});
