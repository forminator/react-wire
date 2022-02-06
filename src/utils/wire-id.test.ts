/*eslint @typescript-eslint/no-unused-vars: ["warn", { "varsIgnorePattern": "^_" }]*/
import { createId, getLinkIds, getWireId, LinkIds, WireId } from './wire-id';

describe('create id', function () {
  it('should create a valid id', function () {
    const id = createId();
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
  });
  it('should accepts prefix', function () {
    const id = createId('prefix');
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
    expect(id.startsWith('prefix')).toBeTruthy();
  });
});

describe('get wire id', function () {
  it('should returns undefined for undefined', function () {
    expect(getWireId(undefined)).toBeUndefined();
  });
  it('have correct type', function () {
    function _f0(w0: undefined, w1: WireId, w2: WireId | undefined) {
      let _r0: undefined = getWireId(w0);
      let _r1: string = getWireId(w1);
      let _r2: string | undefined = getWireId(w2);
    }
  });
});
describe('get link ids', function () {
  it('should returns undefined for undefined', function () {
    expect(getLinkIds(undefined)).toBeUndefined();
  });
  it('have correct type', function () {
    function _f0(w0: undefined, w1: WireId, w2: WireId | undefined) {
      let _r0: undefined = getLinkIds(w0);
      let _r1: LinkIds = getLinkIds(w1);
      let _r2: LinkIds | undefined = getLinkIds(w2);
    }
  });
});
