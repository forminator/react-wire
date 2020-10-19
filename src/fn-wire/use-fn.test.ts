import { act, renderHook } from '@testing-library/react-hooks';
import { FnsWire } from './fns-wire';
import { useFn } from './use-fn';
import { useFnsWire } from './use-fns-wire';

describe('useFn', () => {
  it('should subscribe on fns', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const wire = useFnsWire<{ test(n: number): void }>(null);
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should accept null or undefined wire', () => {
    const fn = jest.fn();
    const { result } = renderHook((): {
      wire: FnsWire<{ test(n: number): void }> | null;
    } => {
      const wire = null;
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire?.fns.test(3);
    });
    expect(fn).not.toBeCalled();
  });
  it('should subscribe on fns with parent', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire = useFnsWire<{ test(n: number): void }>(parent);
      useFn(wire, 'test', fn);
      return { wire };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should subscribe on fns with parent, listen on parent', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire = useFnsWire<{ test(n: number): void }>(parent);
      useFn(parent, 'test', fn);
      return { wire, parent };
    });
    act(() => {
      result.current.wire.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should subscribe on fns with parent, fire on parent', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire = useFnsWire<{ test(n: number): void }>(parent);
      useFn(wire, 'test', fn);
      return { wire, parent };
    });
    act(() => {
      result.current.parent.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
  it('should subscribe on fns with sibling', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => {
      const parent = useFnsWire<{ test(n: number): void }>(null);
      const wire1 = useFnsWire<{ test(n: number): void }>(parent);
      const wire2 = useFnsWire<{ test(n: number): void }>(parent);
      useFn(wire1, 'test', fn);
      return { wire1, wire2 };
    });
    act(() => {
      result.current.wire2.fns.test(3);
    });
    expect(fn).toBeCalledWith(3);
  });
});
