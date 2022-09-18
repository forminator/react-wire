import { describe, expect, it, vi } from 'vitest';
import { createStateWire } from '../state-wire/create-state-wire';
import { getLinkIds, getWireId } from '../utils/wire-id';
import { createStateSelector } from './create-state-selector';

const createDoubleValueSelector = () => {
  const [wire, connectWire] = createStateWire({}, 2);
  connectWire();
  const [selector, connect] = createStateSelector({
    get: ({ get }) => {
      return get(wire) * 2;
    },
  });
  return { selector, connect, wire };
};

const createAreaValueSelector = () => {
  const [wire1, connectWire1] = createStateWire({}, 2);
  const [wire2, connectWire2] = createStateWire({}, 3);
  connectWire1();
  connectWire2();
  const [selector, connect] = createStateSelector({
    get: ({ get }) => {
      return get(wire1) * get(wire2);
    },
  });
  return { selector, connect, wire1, wire2 };
};

const createPropSelector = () => {
  const [wire, connectWire] = createStateWire({}, { a: 1 });
  connectWire();
  const [selector, connect] = createStateSelector({
    get: ({ get }) => {
      return get(wire).a;
    },
  });
  return { selector, connect, wire };
};

const createBoxSelector = () => {
  const [wire, connectWire] = createStateWire({}, 1);
  connectWire();
  const [selector, connect] = createStateSelector({
    get: ({ get }) => {
      return { a: get(wire) };
    },
  });
  return { selector, connect, wire };
};

const createConditionalSelector = () => {
  const [wire1, connectWire1] = createStateWire({}, 2);
  const [wire2, connectWire2] = createStateWire({}, 3);
  const [wire3, connectWire3] = createStateWire<boolean>({}, true);
  connectWire1();
  connectWire2();
  connectWire3();
  const [selector, connect] = createStateSelector({
    get: ({ get }) => {
      return get(wire3) ? get(wire1) : get(wire2);
    },
  });
  return { selector, connect, wire1, wire2, wire3 };
};

const createWritableDoubleValueSelector = () => {
  const [wire, connectWire] = createStateWire({}, 2);
  connectWire();
  const [selector, connect] = createStateSelector<number>({
    get: ({ get }) => {
      return get(wire) * 2;
    },
    set: ({ set }, value) => {
      set(wire, value / 2);
    },
  });
  return { selector, connect, wire };
};

const createWritableAreaValueSelector = (value1: number, value2: number) => {
  const [wire1, connectWire1] = createStateWire({}, value1);
  const [wire2, connectWire2] = createStateWire({}, value2);
  connectWire1();
  connectWire2();
  const [selector, connect] = createStateSelector<number>({
    get: ({ get }) => {
      return get(wire1) * get(wire2);
    },
    set: ({ get, set }, value) => {
      set(wire2, value / get(wire1));
    },
  });
  return { selector, connect, wire1, wire2 };
};

describe('selector', () => {
  describe('single wire', () => {
    it('should have correct initial value before connect', () => {
      const { selector } = createDoubleValueSelector();
      expect(selector.getValue()).toBe(4);
    });
    it('should have correct value after connect', () => {
      const [wire, connectWire] = createStateWire({}, 2);
      connectWire();
      const [selector, connect] = createStateSelector({
        get: ({ get }) => {
          return get(wire) * 2;
        },
      });
      connect();
      expect(selector.getValue()).toBe(4);
    });
    it('should update value after connect if wire value changed', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      wire.setValue(3);
      connect();
      expect(selector.getValue()).toBe(6);
    });
    it('should update value after wire value changed', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      connect();
      wire.setValue(3);
      expect(selector.getValue()).toBe(6);
    });
    it('should call subscribe function when value changed', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      connect();
      const fn = vi.fn();
      const unsubscribe = selector.subscribe(fn);
      wire.setValue(3);
      unsubscribe();
      expect(fn).toBeCalledWith(6);
    });
    it('should not call subscribe function after unsubscribe', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      connect();
      const fn = vi.fn();
      const unsubscribe = selector.subscribe(fn);
      unsubscribe();
      wire.setValue(3);
      expect(fn).not.toBeCalled();
    });
    it('should not change after disconnect', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      const disconnect = connect();
      const fn = vi.fn();
      const unsubscribe = selector.subscribe(fn);
      disconnect();
      wire.setValue(3);
      unsubscribe();
      expect(selector.getValue()).toBe(4);
      expect(fn).not.toBeCalled();
    });
    it('should be connected after multiple connect and disconnect and connect', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      connect()();
      connect()();
      connect();
      const fn = vi.fn();
      const unsubscribe = selector.subscribe(fn);
      wire.setValue(3);
      unsubscribe();
      expect(fn).toBeCalledWith(6);
      expect(selector.getValue()).toBe(6);
    });
    it('should be disconnected after multiple connect and disconnect', () => {
      const { selector, wire, connect } = createDoubleValueSelector();
      connect()();
      connect()();
      connect()();
      const fn = vi.fn();
      const unsubscribe = selector.subscribe(fn);
      wire.setValue(3);
      unsubscribe();
      expect(selector.getValue()).toBe(4);
      expect(fn).not.toBeCalled();
    });
  });
  describe('multiple wires', () => {
    it('should have correct initial value before connect', () => {
      const { selector } = createAreaValueSelector();
      expect(selector.getValue()).toBe(6);
    });
    it('should have correct value after connect', () => {
      const { selector, connect } = createAreaValueSelector();
      connect();
      expect(selector.getValue()).toBe(6);
    });
    it('should update value after connect if wire value changed', () => {
      const { selector, connect, wire1 } = createAreaValueSelector();
      wire1.setValue(3);
      connect();
      expect(selector.getValue()).toBe(9);
    });
    it('should update value after wire value changed', () => {
      const { selector, connect, wire1 } = createAreaValueSelector();
      connect();
      wire1.setValue(3);
      expect(selector.getValue()).toBe(9);
    });
    it('should call subscribe function when value changed', () => {
      const { selector, connect, wire1 } = createAreaValueSelector();
      connect();
      const fn = vi.fn();
      const unsubscribe = selector.subscribe(fn);
      wire1.setValue(3);
      unsubscribe();
      expect(fn).toBeCalledWith(9);
    });
  });

  describe('prop selector', () => {
    it('should not trigger when final value is not changed', () => {
      const fn = vi.fn();
      const { selector, connect, wire } = createPropSelector();
      connect();
      selector.subscribe(fn);
      wire.setValue({ a: 1 });
      expect(fn).not.toBeCalled();
    });
  });

  describe('box selector', () => {
    it('should not changed on connect if dependency wires not changed', () => {
      const { selector, connect } = createBoxSelector();
      const value = selector.getValue();
      connect();
      expect(selector.getValue()).toBe(value);
    });
    it('should changed on connect if dependency wires changed', () => {
      const { selector, connect, wire } = createBoxSelector();
      const value = selector.getValue();
      wire.setValue(5);
      connect();
      expect(selector.getValue()).not.toBe(value);
      expect(selector.getValue()).toEqual({ a: 5 });
    });
  });

  describe('conditional selector', () => {
    it('should have correct initial value before connect', () => {
      const { selector } = createConditionalSelector();
      expect(selector.getValue()).toBe(2);
    });
    it('should have correct value after connect', () => {
      const { selector, connect } = createConditionalSelector();
      connect();
      expect(selector.getValue()).toBe(2);
    });

    describe('change value', () => {
      it('should update value after connect if wire value changed', () => {
        const { selector, connect, wire1 } = createConditionalSelector();
        wire1.setValue(4);
        connect();
        expect(selector.getValue()).toBe(4);
      });
      it('should update value after wire value changed', () => {
        const { selector, connect, wire1 } = createConditionalSelector();
        connect();
        wire1.setValue(4);
        expect(selector.getValue()).toBe(4);
      });
      it('should call subscribe function when value changed', () => {
        const { selector, connect, wire1 } = createConditionalSelector();
        connect();
        const fn = vi.fn();
        const unsubscribe = selector.subscribe(fn);
        wire1.setValue(4);
        unsubscribe();
        expect(fn).toBeCalledWith(4);
      });
      it('should not call subscribe function when unused value changed', () => {
        const { selector, connect, wire2 } = createConditionalSelector();
        connect();
        const fn = vi.fn();
        const unsubscribe = selector.subscribe(fn);
        wire2.setValue(5);
        unsubscribe();
        expect(fn).not.toBeCalled();
      });
    });

    describe('change condition', () => {
      it('should update value after connect if wire value changed', () => {
        const { selector, connect, wire3 } = createConditionalSelector();
        wire3.setValue(false);
        connect();
        expect(selector.getValue()).toBe(3);
      });
      it('should update value after wire value changed', () => {
        const { selector, connect, wire3 } = createConditionalSelector();
        connect();
        wire3.setValue(false);
        expect(selector.getValue()).toBe(3);
      });
      it('should call subscribe function when value changed', () => {
        const { selector, connect, wire3 } = createConditionalSelector();
        connect();
        const fn = vi.fn();
        const unsubscribe = selector.subscribe(fn);
        wire3.setValue(false);
        unsubscribe();
        expect(fn).toBeCalledWith(3);
      });
    });
  });
  describe('writable selector', () => {
    it('should update wire value', () => {
      const { selector, connect, wire } = createWritableDoubleValueSelector();
      connect();
      selector.setValue(8);
      expect(wire.getValue()).toBe(4);
      expect(selector.getValue()).toBe(8);
    });
    it('should update wire value with multiple wire', () => {
      const { selector, connect, wire2 } = createWritableAreaValueSelector(
        2,
        3,
      );
      connect();
      selector.setValue(12);
      expect(wire2.getValue()).toBe(6);
      expect(selector.getValue()).toBe(12);
    });
  });
  describe('ids', function () {
    it('should have same id', function () {
      const [stateSelector] = createStateSelector({ get: () => 1 });
      const id = getWireId(stateSelector);
      expect(getWireId(stateSelector)).toBe(id);
    });
    it('should be last item of link ids', function () {
      const [stateSelector] = createStateSelector({ get: () => 1 });
      const id = getWireId(stateSelector);
      const ids = getLinkIds(stateSelector);
      expect(getLinkIds(stateSelector)).toBe(ids);
      expect(getLinkIds(stateSelector)).toEqual([id]);
    });
    it('should be have up links', function () {
      const { selector, wire } = createDoubleValueSelector();
      const wireId = getWireId(wire);
      const selectorId = getWireId(selector);
      const ids = getLinkIds(selector);
      expect(getLinkIds(selector)).toBe(ids);
      expect(getLinkIds(selector)).toEqual([[wireId], selectorId]);
    });
  });
});
