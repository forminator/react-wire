// @vitest-environment node

import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useSelector, useWire, useWireValue, Wire } from './index';

describe('ssr', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('wire', () => {
    test('use wire value', () => {
      function MyComponent() {
        let wire = useWire(null, 5);
        const value = useWireValue(wire) ?? 'missing';
        return <div>{value}</div>;
      }

      const mockConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let view = renderToString(<MyComponent />);
      expect(mockConsoleError.mock.lastCall).toBeUndefined();

      expect(view).toBe('<div>5</div>');
    });
    test('wire with uplink', () => {
      function Parent() {
        let wire = useWire(null, 5);
        const value = useWireValue(wire) ?? 'missing';
        return (
          <div>
            {value}
            <Child wire={wire} />
          </div>
        );
      }

      function Child(props: { wire: Wire<number> }) {
        let wire = useWire(props.wire, 10);
        const value = useWireValue(wire) ?? 'missing';
        return <span>{value}</span>;
      }

      const mockConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let view = renderToString(<Parent />);
      expect(mockConsoleError.mock.lastCall).toBeUndefined();

      expect(view).toBe('<div>5<span>5</span></div>');
    });
    test('wire with uninitialized uplink', () => {
      function Parent() {
        let wire = useWire<number>(null);
        const value = useWireValue(wire) ?? 'missing';
        return (
          <div>
            {value}
            <Child wire={wire} />
          </div>
        );
      }

      function Child(props: { wire: Wire<number | undefined> }) {
        let wire = useWire(props.wire, 10);
        const value = useWireValue(wire) ?? 'missing';
        return <span>{value}</span>;
      }

      const mockConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let view = renderToString(<Parent />);
      expect(mockConsoleError.mock.lastCall).toEqual([
        'upLink value is undefined. uplink without value is not supported in server side rendering',
      ]);

      expect(view).toBe('<div>missing<span>10</span></div>');
    });
    test('wire with uninitialized uplink and no initial value', () => {
      function Parent() {
        let wire = useWire<number>(null);
        const value = useWireValue(wire) ?? 'missing';
        return (
          <div>
            {value}
            <Child wire={wire} />
          </div>
        );
      }

      function Child(props: { wire: Wire<number | undefined> }) {
        let wire = useWire(props.wire);
        const value = useWireValue(wire) ?? 'missing';
        return <span>{value}</span>;
      }

      const mockConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let view = renderToString(<Parent />);
      expect(mockConsoleError.mock.lastCall).toBeUndefined();

      expect(view).toBe('<div>missing<span>missing</span></div>');
    });
    test('wire with uninitialized uplink with sibling', () => {
      function Parent() {
        let wire = useWire<number>(null);
        const value = useWireValue(wire) ?? 'missing';
        return (
          <div>
            {value}
            <Child wire={wire} init={1} />
            <Child wire={wire} init={2} />
          </div>
        );
      }

      function Child(props: { wire: Wire<number | undefined>; init: number }) {
        let wire = useWire(props.wire, props.init);
        const value = useWireValue(wire) ?? 'missing';
        return <span>{value}</span>;
      }

      const mockConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let view = renderToString(<Parent />);
      expect(mockConsoleError.mock.lastCall).toEqual([
        'upLink value is undefined. uplink without value is not supported in server side rendering',
      ]);

      expect(view).toBe('<div>missing<span>1</span><span>2</span></div>');
    });
  });
  describe('selector', () => {
    test('selector', () => {
      function MyComponent() {
        let wire = useWire(null, 5);
        let double = useSelector({ get: ({ get }) => get(wire) * 2 }, [wire]);
        const value = useWireValue(wire) ?? 'missing';
        const doubleValue = useWireValue(double) ?? 'missing';
        return (
          <div>
            {value}x2={doubleValue}
          </div>
        );
      }

      const mockConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      let view = renderToString(<MyComponent />);
      expect(mockConsoleError.mock.lastCall).toBeUndefined();

      expect(view).toBe('<div>5<!-- -->x2=<!-- -->10</div>');
    });
  });
});
