import { createStateSelector } from './state-selector/create-state-selector';
import { createStateWire } from './state-wire/create-state-wire';
import LeakDetector from 'jest-leak-detector';

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
});
