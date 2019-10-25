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
});
