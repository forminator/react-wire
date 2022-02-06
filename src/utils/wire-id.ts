export type LinkIds = Array<string | LinkIds>;
export interface WireId {
  /**
   * @internal
   */
  _getId(): string;
  /**
   * @internal
   */
  _getLinkIds(): LinkIds;
}

let lastId = 0;

export function createId(prefix: string = ''): string {
  const id = lastId++;
  return `${prefix}${id}`;
}

export function getWireId(wire: undefined): undefined;
export function getWireId(wire: WireId): string;
export function getWireId(wire: WireId | undefined): string | undefined;
export function getWireId(wire: WireId | undefined): string | undefined {
  return wire?._getId() ?? undefined;
}
export function getLinkIds(wire: undefined): undefined;
export function getLinkIds(wire: WireId): LinkIds;
export function getLinkIds(wire: WireId | undefined): LinkIds | undefined;
export function getLinkIds(wire: WireId | undefined): LinkIds | undefined {
  return wire?._getLinkIds() ?? undefined;
}
