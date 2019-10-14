/**
 * @public
 */
export interface Options {}

/**
 *
 * return `forminator-react-wire` string
 *
 * @returns the `forminator-react-wire`  string
 *
 * @example
 * Here's an example:
 *
 * ```ts
 * import { ForminatorReactWire } from '@forminator/react-wire'
 *
 * console.log(ForminatorReactWire());
 * // Prints "forminator-react-wire":
 * ```
 */
export function ForminatorReactWire(options?: Options) {
  return 'forminator-react-wire';
}
