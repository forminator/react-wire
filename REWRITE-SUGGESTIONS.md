# Behavior-Preserving Rewrite Suggestions

## Recommendation

Rewrite the internal engine incrementally behind the existing public API, rather
than replacing the entire implementation at once.

The project is already small and reasonably separated. The main challenge is
preserving lifecycle timing, reference identity, event semantics, and TypeScript
inference, not reproducing `getValue()` and `setValue()`.

These recommendations are based on a read-through of the implementation, tests,
test helpers, public declarations, consumer fixture, build configuration, CI,
README, and changelog.

## Proposed Architecture

Retain three layers:

```text
Public API and types
        |
React hooks and lifecycle adapters
        |
React-independent state, selectors, and function events
```

The current project largely follows this structure. Sharpen these boundaries
instead of introducing a larger framework.

| Area           | Suggested approach                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| State wires    | Keep a small closure-based implementation with explicit local value, uplink, and connection lifecycle. |
| Selectors      | Separate dependency collection, subscription reconciliation, and cached-result updates.                |
| Function wires | Keep event forwarding separate from state propagation.                                                 |
| Interceptors   | Keep write-only wrappers that preserve the underlying wire's other capabilities.                       |
| React hooks    | Own construction, connection, replacement, and cleanup; leave state computation in the core.           |
| Public types   | Preserve overloads, generic defaults, variance guards, and exported names exactly.                     |

Do not introduce Redux, Zustand, RxJS, or another reactive engine solely for this
rewrite. Their scheduling, equality, and subscription semantics would add
compatibility work without an obvious benefit.

## Compatibility Requirements

### Equality

Core change detection uses `===` and `!==`. Replacing these comparisons with
`Object.is` changes `NaN` and signed-zero behavior. React's snapshot comparison
is a separate concern.

### Undefined and Null

`undefined` means uninitialized; `null` is a real value. Defaults and
initialization must preserve this distinction. Functional updates in
`useWireState` do not call the updater when the current value is undefined, and
undefined update results are ignored.

### Initialization and Rewiring

A defined uplink value wins over a local initializer. An empty uplink can receive
a child's initial value during connection, so sibling initialization order
matters.

Switching to an undefined uplink can initialize it with the previous value. Old
subscriptions must be removed, and subsequent writes must target the new uplink.

The main implementation owners are
[create-state-wire.ts](src/state-wire/create-state-wire.ts) and
[use-state-wire.ts](src/state-wire/use-state-wire.ts).

### Selectors

Selectors cache their result and track only dependencies read by the active
branch. Subscription reconciliation must still happen when the dependency set
changes but the derived value remains equal.

Connecting without dependency changes must preserve an object-valued result's
identity. Setter-side reads must not become getter dependencies. Hook option
updates must continue to respect the supplied dependency list.

The main implementation owner is
[create-state-selector.ts](src/state-selector/create-state-selector.ts).

### Function Events

Function calls are synchronous events. Parent, child, and sibling listeners share
the uplink event channel. This is not an RPC mechanism that returns listener
results.

Preserve dispatch order, duplicate registration behavior, cleanup, exception
propagation, and listener changes during dispatch.

### Interceptors

Interceptors affect writes through the wrapper only. Direct upstream writes
bypass them, and chained interceptors execute from downstream to upstream.
Returning undefined rejects the write.

Preserve the underlying wire's function capabilities, IDs, and other properties.

### Identity and Object Shape

Wire IDs, nested link-ID structure, memoized array references, wrapper references,
and method references are observable and should have explicit compatibility
tests. Preserve public guard properties and their type behavior as well.

### React and Server Rendering

Keep connection and cleanup timing compatible with StrictMode, Suspense, and
interrupted rendering. Avoid upstream initialization or subscription side
effects during render.

SSR differs from CSR: effects do not initialize empty uplinks on the server, and
the current warning behavior is tested. Preserve server output and warning
conditions during the rewrite.

## Internal Improvements

1. **Make lifecycle operations explicit.** State wires return a disconnect
   function, while selectors return a function that either updates options or
   disconnects. Separate internal operations would be easier to reason about
   without changing public exports.
2. **Simplify selector bookkeeping.** Dependency tracking and unsubscribe handles
   currently share maps containing nullable entries. Separate those
   responsibilities while preserving dependency order and subscription reuse.
3. **Keep `useSyncExternalStore`.**
   [use-wire-value.ts](src/state-wire/use-wire-value.ts) already uses the correct
   React primitive. An effect-driven `useState` subscription would introduce
   regression risk.
4. **Keep `mitt` initially.** Replacing it with a `Set` can change duplicate
   registration and dispatch behavior. Dependency removal should be a separate,
   measured change.
5. **Avoid automatic modernizations.** Caching proxy methods, stabilizing wrappers
   across uplink replacement, batching selector writes, or adding lazy
   subscriptions can change observable behavior. Evaluate each separately after
   parity is established.

## Verification Strategy

Expand the existing tests before replacing implementation code:

- Run identical operation sequences against old and new implementations. Compare
  values, callback order and count, errors, and identity relationships. Compare ID
  stability and topology rather than assuming independent implementations share
  the same global counter values.
- Cover `NaN`, signed zero, duplicate listeners, listener mutation during
  dispatch, nested writes, and thrown callbacks.
- Cover selector chains and diamond graphs, branch switching with an unchanged
  result, and changes between construction and connection.
- Cover hook callback replacement, unmount, StrictMode replay, interrupted
  rendering, and SSR hydration.
- Add compile-time consumer tests against [index.d.ts](index.d.ts), including
  accepted and rejected assignments, overload selection, readonly covariance,
  writable invariance, and function parameter compatibility.
- Run runtime coverage on both React 18 and 19. The current
  [package fixture script](tests/package-e2e.sh) checks packaging and builds on
  both, but not the full hook behavior suite. React 19-specific tests require a
  separate compatible test selection for React 18.
- Preserve package exports, ESM entry points, declaration generation, and packed
  consumer behavior. Run existing formatting, lint, type, test, build, and package
  checks as release gates.

Passing the existing suite is necessary but not sufficient to establish behavior
parity. Add characterization tests for currently uncovered observable behavior
before deciding whether it can change.

## Known Contract Discrepancies

- [README.md](README.md) discourages rewiring and mentions warnings, while the
  implementation and tests support uplink replacement.
- The literal-null `useWireValue` overload declares an undefined return type even
  though the implementation can return a supplied default.

Record these discrepancies explicitly. Correct documentation to reflect verified
behavior, but do not silently change runtime behavior or public declarations as
part of a strict compatibility rewrite. Fixes that change those contracts should
be separately approved and released.

## Suggested Execution Order

1. Freeze the public declarations and document the compatibility contract.
2. Add missing characterization, differential, and consumer type tests.
3. Rewrite the state core and verify parity.
4. Rewrite function-event internals and verify parity.
5. Rewrite selector internals and verify parity.
6. Refine React lifecycle adapters and interceptors, retaining existing timing
   and identity behavior.
7. Verify generated declarations and packed consumers on React 18 and 19.

Keep each stage independently reviewable. Postpone tooling migrations, dependency
removal, performance optimizations, and new features until compatibility is
established.

## Validation Status

During the initial review, tests and typechecking could not run because the
pinned pnpm 11.17.0 executable was missing and dependencies were not installed.
These recommendations are based on static inspection, not a confirmed passing
baseline. Restore the local toolchain and establish that baseline before starting
the rewrite.

## Success Criteria

The rewrite should improve ownership, readability, and verification without
requiring consumer changes. Favor a small, explicit engine over fewer files or a
more sophisticated abstraction. A successful rewrite should be uneventful for
existing users.
