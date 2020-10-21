import { renderHook } from '@testing-library/react-hooks';
import { useCallback } from 'react';
import { act } from 'react-dom/test-utils';
import { useStateWire } from './use-state-wire';
import { useSubscribe } from './use-subscribe';

describe('useSubscribe', () => {
  it('should not call the callback function on subscribing', () => {
    const fn = jest.fn();

    renderHook(() => {
      const wire = useStateWire(null, 5);
      useSubscribe(
        wire,
        useCallback((value) => {
          fn(value);
        }, []),
      );
      return { wire };
    });
    expect(fn).not.toBeCalled();
  });

  it('should call the callback function when the wire value updates', () => {
    const fn = jest.fn();

    const { result } = renderHook(() => {
      const wire = useStateWire(null, 5);
      useSubscribe(
        wire,
        useCallback((value) => {
          fn(value);
        }, []),
      );
      return { wire };
    });
    act(() => {
      result.current.wire.setValue(3);
    });

    expect(fn).toBeCalledWith(3);
  });

  it('should not call the callback function after unmount', () => {
    const fn = jest.fn();

    const { result, unmount } = renderHook(() => {
      const wire = useStateWire(null, 5);
      useSubscribe(
        wire,
        useCallback((value) => {
          fn(value);
        }, []),
      );
      return { wire };
    });
    act(() => {
      unmount();
    });
    act(() => {
      result.current.wire.setValue(3);
    });

    expect(fn).not.toBeCalled();
  });
});
