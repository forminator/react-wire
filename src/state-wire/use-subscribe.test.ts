import { act, renderHook } from '../test/render-hook';
import { useCallback } from 'react';
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

  it('should not call the callback function when the new value is same', () => {
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
      result.current.wire.setValue(5);
    });

    expect(fn).not.toBeCalled();
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

  describe('with uplink', () => {
    it('should not call the callback function when the new value is same (same value)', () => {
      const fn = jest.fn();

      const { result } = renderHook(() => {
        const upLink = useStateWire(null, 5);
        const wire = useStateWire(upLink, 5);
        useSubscribe(
          wire,
          useCallback((value) => {
            fn(value);
          }, []),
        );
        return { wire };
      });
      act(() => {
        result.current.wire.setValue(5);
      });

      expect(fn).not.toBeCalled();
    });

    it('should not call the callback function when the new value is same (different value)', () => {
      const fn = jest.fn();

      const { result } = renderHook(() => {
        const upLink = useStateWire(null, 5);
        const wire = useStateWire(upLink, 4);
        useSubscribe(
          wire,
          useCallback((value) => {
            fn(value);
          }, []),
        );
        return { wire };
      });
      act(() => {
        result.current.wire.setValue(5);
      });

      expect(fn).not.toBeCalled();
    });

    it('should not call the callback function when the new value is same (undefined uplink value)', () => {
      const fn = jest.fn();

      const { result } = renderHook(() => {
        const upLink = useStateWire(null);
        const wire = useStateWire(upLink, 5);
        useSubscribe(
          wire,
          useCallback((value) => {
            fn(value);
          }, []),
        );
        return { wire };
      });
      act(() => {
        result.current.wire.setValue(5);
      });

      expect(fn).not.toBeCalled();
    });

    it('should not call the callback function when the new value is same (undefined value)', () => {
      const fn = jest.fn();

      const { result } = renderHook(() => {
        const upLink = useStateWire(null, 5);
        const wire = useStateWire(upLink);
        useSubscribe(
          wire,
          useCallback((value) => {
            fn(value);
          }, []),
        );
        return { wire };
      });
      act(() => {
        result.current.wire.setValue(5);
      });

      expect(fn).not.toBeCalled();
    });
    it('should call the callback when the value changes between render and effect', () => {
      const fn = jest.fn();

      renderHook(() => {
        const upLink = useStateWire(null);
        useStateWire(upLink, 4);
        useSubscribe(
          upLink,
          useCallback((value) => {
            fn(value);
          }, []),
        );
      });

      expect(fn).toBeCalledWith(4);
    });
  });
});
