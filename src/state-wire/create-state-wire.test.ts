import { describe, expect, it } from 'vitest';
import { getLinkIds, getWireId } from '../utils/wire-id';
import { createStateWire } from './create-state-wire';

describe('create state wire', function () {
  it('should create state wire', function () {
    const stateWire = createStateWire({}, 1);
    expect(stateWire).toBeDefined();
  });
  it('should have same id', function () {
    const [stateWire] = createStateWire({}, 1);
    const id = getWireId(stateWire);
    expect(getWireId(stateWire)).toBe(id);
  });
  it('should be last item of link ids', function () {
    const [stateWire] = createStateWire({}, 1);
    const id = getWireId(stateWire);
    expect(getLinkIds(stateWire)).toEqual([id]);
  });
  it('should have uplink id in link ids', function () {
    const [upLink] = createStateWire({}, 1);
    const [stateWire] = createStateWire(upLink, 1);
    const uplinkId = getWireId(upLink);
    const id = getWireId(stateWire);
    expect(getLinkIds(stateWire)).toEqual([uplinkId, id]);
  });
  it('should have same array for uplink id in link ids', function () {
    const [upLink] = createStateWire({}, 1);
    const [stateWire] = createStateWire(upLink, 1);
    const uplinkId = getWireId(upLink);
    const id = getWireId(stateWire);
    const ids = getLinkIds(stateWire);
    expect(getLinkIds(stateWire)).toBe(ids);
    expect(getLinkIds(stateWire)).toEqual([uplinkId, id]);
  });
});
