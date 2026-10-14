# API and Behavior Evolution Suggestions

## Goal

Improve the API and behavior while keeping the wire model, familiar entry points,
and migration effort as close to the current library as practical.

This is a separate proposal from the strict compatibility rewrite described in
[REWRITE-SUGGESTIONS.md](REWRITE-SUGGESTIONS.md). The APIs below are proposals, not
currently implemented features.

## Priorities

| Change              | Recommendation                                                 | Migration impact                                           |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| Equality            | Use `Object.is` by default.                                    | Low; changes `NaN` and signed-zero behavior.               |
| Undefined           | Distinguish uninitialized state from a stored undefined value. | Medium; retain legacy initialization during transition.    |
| Dependency tracking | Automatically track reads inside selector getters.             | Low if `get(wire)` remains supported.                      |
| Selector lifecycle  | Add explicit disposal for standalone selectors.                | Additive.                                                  |
| Functional updates  | Add `wire.update(updater)`.                                    | Additive.                                                  |
| Subscriptions       | Specify dispatch and cleanup semantics explicitly.             | Low to medium, depending on edge-case changes.             |
| React hooks         | Preserve familiar signatures and improve type accuracy.        | Low, with some corrected types exposing existing mistakes. |
| Batching            | Add explicit synchronous `batch()`.                            | Additive; avoid implicit batching initially.               |

## 1. Use Object.is for Equality

Use `Object.is` consistently for state changes, selector results, and subscription
catch-up. This aligns change detection with React and avoids repeated
notifications for `NaN`.

- `NaN` to `NaN`: no notification.
- `0` to `-0`: notification.
- Objects: reference equality, not deep equality.

Eventually support an optional `equals` comparator, especially for selectors.
Custom comparison should not be necessary for ordinary usage. Document that a
comparator can suppress updates and therefore must reflect the distinctions its
consumers care about.

## 2. Make Undefined a Valid Value

The current meaning of undefined mixes two concepts: a stored value and
permission for a child to initialize its parent.

Separate these internally with an initialization flag or private sentinel. Keep
`getValue()` returning ordinary values; never expose the sentinel.

The eventual distinction should be:

```ts
createWire<number>(); // Uninitialized.
createWire<number | undefined>(undefined); // Initialized to undefined.
wire.setValue(undefined); // Explicitly stores undefined, if permitted by its type.
```

Detect omitted arguments separately from explicitly supplied undefined. Apply a
consistent rule to factory and hook initialization signatures, and preserve
`null` as an ordinary value.

For minimal migration pain, do not switch all initialization rules immediately.
Retain existing child-to-parent initialization as a legacy default during a
transition release, and offer an explicit initialization policy. A major release
can adopt the distinction consistently.

Functional updates should be allowed to receive undefined instead of silently
skipping the updater. Types must include undefined when initialization is not
guaranteed. Undefined update results should become valid writes when the state
type permits them.

Keep read fallbacks distinct from initialization: a default passed to
`useWireValue` should not write to the wire. Specify whether that fallback applies
to both uninitialized state and an explicitly stored undefined value; retaining
the current value-based fallback is the lower-migration option.

## 3. Automatically Track Selector Reads

Track reads only inside a selector evaluation, not globally.

```ts
const total = createSelector({
  get: () => price.getValue() * quantity.getValue(),
});
```

Keep the existing form supported:

```ts
const total = createSelector({
  get: ({ get }) => get(price) * get(quantity),
});
```

Both forms should use the same dependency-tracking machinery.

- Use a synchronous tracking context with `try/finally` restoration.
- Support nested selectors and dynamic branches.
- Reject Promise-returning getters initially; asynchronous tracking needs a
  separate design.
- Prevent setter reads and subscriber callbacks from accidentally becoming
  dependencies of an active getter.
- Add an `untracked(() => ...)` escape hatch.
- Continue reconciling dependencies when a branch changes but its result remains
  equal.

Automatic tracking can intercept only participating wire implementations. Keep
`get(wire)` for compatible external wire objects. Avoid wrapping every read with
a Proxy merely to provide tracking; the wire's own `getValue()` can participate
directly.

## 4. Improve Selector Lifecycle and Error Handling

Add cycle detection with useful errors, predictable recovery after a getter
throws, and explicit disposal for standalone selectors:

```ts
const doubled = createSelector({ get: () => count.getValue() * 2 });
doubled.dispose();
```

Disposal should be idempotent and release upstream subscriptions. Define what
reads, writes, and subscriptions do after disposal rather than leaving this
accidental. Hook-created selectors should clean up their connections
automatically and tolerate StrictMode reconnects; permanent disposal must not
prevent an effect replay from reconnecting.

Initially retain eager standalone selectors and cached snapshots. Lazy
subscription can alter getter execution timing and side effects. Document getters
as pure before introducing that change.

## 5. Separate Literal Writes from Functional Updates

Add `wire.update(previous => next)` while keeping `setValue(value)` literal-only.
This makes function-valued state unambiguous and gives non-React consumers
functional updates.

```ts
counter.setValue(10);
counter.update((previous) => previous + 1);
```

For potentially uninitialized state, the updater's parameter must include
undefined. Define updater execution as synchronous against the current value,
with errors propagated to the caller.

Keep `useWireState` familiar, including React-style functional setters. Document
the existing function-value ambiguity there, including the wrapper needed to
store a function.

If update is exposed on interceptor wrappers, route its result through the
intercepted write path. Do not allow it to bypass interception.

Do not silently make interceptors asynchronous or turn function events into
request/response calls.

## 6. Specify Subscription Semantics

Subscriptions should be synchronous, ordered, non-immediate by default, and return
idempotent cleanup functions.

Specify and test:

- Whether duplicate registrations are independent subscriptions.
- Whether listeners added during dispatch wait until the next dispatch.
- Whether removing a listener during dispatch affects the current dispatch.
- How reentrant writes are ordered and which value each notification carries.
- Whether a thrown callback stops delivery or delivery continues before the error
  is reported.
- How callback replacement and render-to-effect catch-up work in `useSubscribe`.

Prefer retaining existing behavior where it is reasonable. Changes to dispatch
ordering or exception handling should be explicit release-note items, not
incidental consequences of replacing `mitt`.

## 7. Add Explicit Synchronous Batching

Add an opt-in operation:

```ts
batch(() => {
  price.setValue(20);
  quantity.setValue(3);
});
```

Writes should become readable immediately, notifications should flush before the
outermost batch returns, and derived subscribers should see settled results.
Selector reads within a batch must return an up-to-date result rather than a stale
cached value.

Implement dependency-aware flushing and test diamond graphs, nested batches,
reentrant writes, and thrown batch callbacks. Specify whether notifications still
flush when the callback throws; batching should not imply rollback.

Do not introduce microtask-based notifications or implicit batching by default.
Keep function events outside state-notification batching unless a separate event
ordering contract is designed.

## 8. Preserve the React API Surface

Keep `useWire`, `useWireValue`, `useWireState`, `useSelector`, `useFn`, and
`useInterceptor`. Keep `useSyncExternalStore` and commit-time connections.

- Correct nullable-wire overloads so return types match supplied defaults.
- Preserve stable references when inputs are unchanged.
- Do not promise unchanged wire identity across rewiring without defining how old
  references behave.
- Keep selector dependency lists for closure changes instead of silently adopting
  latest-callback semantics.
- Preserve SSR isolation: do not initialize shared upstream state or subscribe
  during server render.
- Verify runtime behavior on both React 18 and React 19.

Keep function-event signatures familiar. Treat `fns` as fire-and-forget events;
do not infer a request/response contract from callback return types.

## Migration Strategy

1. Establish characterization tests and a passing baseline before changing
   behavior.
2. Introduce additive features first: automatic selector tracking, `update`,
   `dispose`, and explicit `batch`. Keep old selector getter syntax working.
3. Introduce `Object.is` with release notes and targeted edge-case tests. Although
   migration impact is small, it is a behavior change and should follow the
   project's versioning policy.
4. Introduce initialization and undefined-updater changes in a clearly documented
   major release with a temporary legacy initialization mode.
5. Provide before-and-after examples for affected consumers. Publish a deprecation
   timeline for compatibility options rather than retaining multiple modes
   indefinitely.
6. Validate public types and packed consumers in addition to internal tests.

Avoid combining this work with tooling migrations, a new reactive framework, or
unrelated API renames.

## Recommended First Scope

The highest-value first scope is `Object.is`, tracked selector reads, explicit
selector disposal, and accurate public types.

Treat undefined semantics and batching as separate projects. They offer
substantial improvements but require the most careful behavior design and
migration testing.

## Validation Caveat

The original review was based on static inspection. Tests and typechecking could
not run because the pinned pnpm 11.17.0 executable was unavailable and
dependencies were not installed. Establish a working baseline before implementing
these proposals.
