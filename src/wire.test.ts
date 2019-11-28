import { _WireImpl as Wire } from './wire.impl';

describe('Wire', () => {
  describe('Initial value', () => {
    describe('without up-link', () => {
      it('should be undefined by default', () => {
        const wire = new Wire(null);
        expect(wire.getValue()).toBeUndefined();
      });
      it('should be equal to initial value', () => {
        const wire = new Wire(null, 5);
        expect(wire.getValue()).toBe(5);
      });
    });
    describe('with up-link', () => {
      it('should be undefined when up-link do not have value', () => {
        const upLink = new Wire(null);
        const wire = new Wire(upLink);
        expect(wire.getValue()).toBeUndefined();
      });
      it('should be equal to up-link value', () => {
        const upLink = new Wire(null, 5);
        const wire = new Wire(upLink);
        expect(wire.getValue()).toBe(5);
      });
      it('should be equal to up-link value when both has value', () => {
        const upLink = new Wire(null, 5);
        const wire = new Wire(upLink, 4);
        expect(wire.getValue()).toBe(5);
      });
      it('should have up-link value after disconnect', () => {
        const upLink = new Wire(null, 5);
        const wire = new Wire(upLink, 4);
        wire.disconnect();
        expect(wire.getValue()).toBe(5);
      });
    });
  });
  describe('#connect', () => {
    it('should have value of up-link before connect', () => {
      const upLink = new Wire(null);
      const wire = new Wire(upLink, 4);
      expect(wire.getValue()).toBeUndefined();
    });
    it('should update up-link value if up-link do not have value', () => {
      const upLink = new Wire<number>(null);
      const wire = new Wire(null, 4);
      wire.connect(upLink);
      expect(upLink.getValue()).toBe(4);
      expect(wire.getValue()).toBe(4);
    });
    it('should update up-link value if up-link do not have value', () => {
      const upLink = new Wire<number>(null);
      const wire = new Wire<number>(null);
      wire.connect(upLink);
      expect(upLink.getValue()).toBeUndefined();
      expect(wire.getValue()).toBeUndefined();
    });
    it('should respect up-link value if both have value', () => {
      const upLink = new Wire(null, 5);
      const wire = new Wire(null, 4);
      wire.connect(upLink);
      expect(wire.getValue()).toBe(5);
    });
    it('should update up-link value if up-link do not have value (pre-connected)', () => {
      const upLink = new Wire(null);
      const wire = new Wire(upLink, 4);
      wire.connect(upLink);
      expect(upLink.getValue()).toBe(4);
      expect(wire.getValue()).toBe(4);
    });
    it('should respect up-link value if both have value (pre-connected)', () => {
      const upLink = new Wire(null, 5);
      const wire = new Wire(upLink, 4);
      wire.connect(upLink);
      expect(wire.getValue()).toBe(5);
    });
    it('should respect up-link value if both have value (pre-connected)', () => {
      const upLink = new Wire(null, 5);
      const wire = new Wire(upLink, 4);
      wire.connect(upLink);
      expect(wire.getValue()).toBe(5);
    });
  });
  describe('#setValue', () => {
    it('should update wire value', () => {
      const wire = new Wire(null, 4);
      wire.setValue(5);
      expect(wire.getValue()).toBe(5);
    });
    it('should update up-link wire value', () => {
      const upLink = new Wire(null, 5);
      const wire = new Wire(upLink, 4);
      wire.connect(upLink);
      wire.setValue(6);
      expect(upLink.getValue()).toBe(6);
      expect(wire.getValue()).toBe(6);
    });
    it('should update down-links wire value', () => {
      const upLink = new Wire(null, 5);
      const wire = new Wire(upLink, 4);
      wire.connect(upLink);
      upLink.setValue(6);
      expect(upLink.getValue()).toBe(6);
      expect(wire.getValue()).toBe(6);
    });
  });
  describe('#subscribe', () => {
    it('should call callback function', () => {
      const fn = jest.fn();
      const wire = new Wire(null, 4);
      wire.subscribe(fn);
      wire.setValue(5);
      expect(fn).toBeCalledWith(5);
    });
    it('should call callback function', () => {
      const fn = jest.fn();
      const wire = new Wire(null, 4);
      const unsubscribe = wire.subscribe(fn);
      unsubscribe();
      wire.setValue(5);
      expect(fn).not.toBeCalled();
    });
  });
  describe('#disconnect', () => {
    it('should disconnect correctly', () => {
      const upLink = new Wire(null, 5);
      const wire = new Wire(upLink, 4);
      wire.connect(upLink);
      wire.disconnect();
      wire.disconnect(); // noop
    });
  });
  // TODO we can add more test about subscribe for connected wires
  describe('fns', () => {
    it('should throw error with * type', () => {
      const wire = new Wire<any, any>(null);
      const fn = jest.fn();
      expect(() => {
        const dispose = wire.fn('*', fn);
        dispose();
      }).toThrowError();
    });

    describe('without up-link wire', () => {
      it('should fire event', () => {
        const wire = new Wire<any, { test(n: number): void }>(null);
        const fn = jest.fn();
        const dispose = wire.fn('test', fn);
        wire.fns.test(3);
        expect(fn).toBeCalledWith(3);
        dispose();
      });
    });
    describe('with up-link wire', () => {
      it('should fire event from wire', () => {
        const wire1 = new Wire<any, { test(n: number): void }>(null);
        const wire2 = new Wire<any, { test(n: number): void }>(wire1);
        wire2.connect(wire1);
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const dispose1 = wire1.fn('test', fn1);
        const dispose2 = wire2.fn('test', fn2);
        wire2.fns.test(3);
        expect(fn1).toBeCalledWith(3);
        expect(fn2).toBeCalledWith(3);
        dispose2();
        dispose1();
      });
      it('should fire event from up-link', () => {
        const wire1 = new Wire<any, { test(n: number): void }>(null);
        const wire2 = new Wire<any, { test(n: number): void }>(wire1);
        wire2.connect(wire1);
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const dispose1 = wire1.fn('test', fn1);
        const dispose2 = wire2.fn('test', fn2);
        wire1.fns.test(3);
        expect(fn1).toBeCalledWith(3);
        expect(fn2).toBeCalledWith(3);
        dispose2();
        dispose1();
      });
      it('should fire event on sibling', () => {
        const wire1 = new Wire<any, { test(n: number): void }>(null);
        const wire2 = new Wire<any, { test(n: number): void }>(wire1);
        const wire3 = new Wire<any, { test(n: number): void }>(wire1);
        wire2.connect(wire1);
        wire3.connect(wire1);
        const fn = jest.fn();
        const dispose = wire2.fn('test', fn);
        wire3.fns.test(3);
        expect(fn).toBeCalledWith(3);
        dispose();
      });
    });
  });
});
