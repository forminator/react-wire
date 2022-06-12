import LeakDetector from 'jest-leak-detector';
import { createFnsWire } from './fn-wire/create-fns-wire';
import { createStateSelector } from './state-selector/create-state-selector';
import { createStateWire } from './state-wire/create-state-wire';

describe('memory', () => {
  describe('create state wire', () => {
    it('should not leak wire after connect', async () => {
      function run(init: unknown): unknown {
        const [wire1, connect1] = createStateWire({}, init);
        const [wire2, connect2] = createStateWire(wire1);
        connect1();
        connect2();
        return wire2;
      }

      let value: unknown = {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let wire = run(value);

      const detector = new LeakDetector(value);
      value = null;
      expect(await detector.isLeaking()).toBe(true);
      wire = null;
      expect(await detector.isLeaking()).toBe(false);
    });
  });

  describe('create state selector', () => {
    it('should not leak wire after connect', async () => {
      function run(init: unknown): unknown {
        const [wire, connectWire] = createStateWire({}, init);
        const [selector, connect] = createStateSelector({
          get: ({ get }) => get(wire),
        });
        connectWire();
        connect();
        return selector;
      }

      let value: unknown = {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let selector = run(value);

      const detector = new LeakDetector(value);
      value = null;
      expect(await detector.isLeaking()).toBe(true);
      selector = null;
      expect(await detector.isLeaking()).toBe(false);
    });
  });

  describe('create fns wire', () => {
    it('should not leak wire after subscribe', async () => {
      function use(value: unknown) {}
      function run(): [unknown, unknown] {
        const [fnsWire, connect] = createFnsWire({});
        connect();
        const obj = {};
        fnsWire.fn('test', () => {
          use(obj);
        });
        return [fnsWire, obj];
      }

      let value = run() as any;
      let [wire, obj] = value;
      value = null;
      const detectorWire = new LeakDetector(wire);
      const detectorObj = new LeakDetector(obj);
      obj = null;
      expect(await detectorObj.isLeaking()).toBe(true);
      wire = null;
      expect(await detectorWire.isLeaking()).toBe(false);
      expect(await detectorObj.isLeaking()).toBe(false);
    });
    it('should not leak wire after connect and subscribe', async () => {
      function run(): [unknown, unknown] {
        const [wire1, connect1] = createFnsWire({});
        const [wire2, connect2] = createFnsWire(wire1);
        connect1();
        connect2();
        wire2.fn('test', () => {});
        return [wire1, wire2];
      }

      let values = run() as any;
      let [wire1, wire2] = values;
      values = null;
      const detector1 = new LeakDetector(wire1);
      const detector2 = new LeakDetector(wire2);
      wire1 = null;
      expect(await detector1.isLeaking()).toBe(true);
      expect(await detector2.isLeaking()).toBe(true);
      wire2 = null;
      expect(await detector1.isLeaking()).toBe(false);
      expect(await detector2.isLeaking()).toBe(false);
    });
  });
});
