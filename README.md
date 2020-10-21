# @forminator/react-wire

[![NPM version](https://badgen.net/npm/v/@forminator/react-wire)](https://npmjs.com/package/@forminator/react-wire)
[![NPM downloads](https://badgen.net/npm/dm/@forminator/react-wire)](https://npmjs.com/package/@forminator/react-wire)
[![Build Status](https://travis-ci.com/forminator/react-wire.svg?branch=master)](https://travis-ci.com/forminator/react-wire)
[![codecov](https://codecov.io/gh/forminator/react-wire/branch/master/graph/badge.svg)](https://codecov.io/gh/forminator/react-wire)

connect react components with wire

<!-- toc -->

- [Install](#install)
- [Usage](#usage)
  - [`useWire` hook](#usewire-hook)
  - [`useWireValue` hook](#usewirevalue-hook)
  - [`useWireState` hook](#usewirestate-hook)
  - [get/set wire value](#getset-wire-value)
  - [`fns` object and `useFn` hook](#fns-object-and-usefn-hook)
- [Advanced usages](#advanced-usages)
  - [Global wire](#global-wire)
  - [`useSelector` hook](#useselector-hook)
  - [`createSelector` function](#createselector-function)
  - [`useSubscribe` hook](#usesubscribe-hook)
  - [Subscribe to the wire](#subscribe-to-the-wire)
  - [`useInterceptor` hook](#useinterceptor-hook)
- [Notes](#notes)
  - [`undefined` value vs `null` value](#undefined-value-vs-null-value)
  - [Initial value](#initial-value)
  - [Rewiring](#rewiring)

<!-- tocstop -->

## Install

```bash
yarn add @forminator/react-wire
```

Add [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) to support ie browser. proxy support is more than 90% in browsers, [more detail](https://caniuse.com/#feat=proxy)

## Usage

### `useWire` hook

`useWire` hook creates and returns new wire. in the next renders, returns the same wire.

```tsx
// without up-link wire and initial value
const wire = useWire<type>(null);
```

```tsx
// with initial value
const wire = useWire(null, initialValue);
```

```tsx
// with up-link wire
const wire = useWire(anotherWire);
```

```tsx
// with up-link and initial value
const wire = useWire(anotherWire, initialValue);
```

- If up-link wire has value, initial value will be ignored
- If up-link wire has `undefined` value, initial value will be set on up-link wire

```tsx
// Lazy initial value
const wire = useWire(anotherWire, () => initialValue);
```

### `useWireValue` hook

`useWireValue` hook returns current wire value and subscribes for value updates

```tsx
const value = useWireValue(wire);
```

```tsx
// returns `defaultValue` if the wire is `null` or `undefined` or wire has an `undefined` value
const value = useWireValue(wire, defaultValue);
```

### `useWireState` hook

`useWireState` behaves like react `useState`, and keeps state and wire value in sync

```tsx
// exactly same as useState
const [state, setState] = useWireState(null, initialValue);
```

```tsx
// without initial value
const [state, setState] = useWireState(wire);
```

```tsx
// with wire and initial value
const [state, setState] = useWireState(wire, initialValue);
```

- If the wire has value, the initial value will be ignored and respect wire value
- If the wire has `undefined` value, the initial value will be used and wire value will be updated

```tsx
// Lazy initial value
const [state, setState] = useWireState(wire, () => initialValue);
```

```tsx
// new value
setState(value);
```

```tsx
// functional update
setState((value) => update(value));
```

**note**: If current state is `undefined`, updater function won't be called! you can pass `initialValue` to `useWireState` or make sure the wire has value to avoid this behavior.

### get/set wire value

```tsx
// get value
const value = wire.getValue();
```

```tsx
// set value
wire.setValue(someValue);
```

### `fns` object and `useFn` hook

With `fns` object and `useFn` hook, you can transfer function calls over wires. Callback function should be memoized with useCallback

```ts
// subscribe for `sample` function call
useFn(
  wire,
  'sample',
  useCallback((value) => {
    console.log(value);
  }, []),
);

// call `sample` function
wire.fns.sample(5);
```

you can define typing for `fns` and `useFn`.

```ts
type Value = number;
interface Fns {
  sample: (n: number) => void;
}

const wire = useWire<Value, Fns>(null);
```

```ts
// code
wire.fns.sample();
```

error:

```
error TS2554: Expected 1 arguments, but got 0.
wire.fns.sample();
         ~~~~~~~~
    sample: (n: number) => void;
             ~~~~~~~~~
    An argument for 'n' was not provided.
```

```ts
// code
useFn(
  wire,
  'sample',
  useCallback((n: string) => {}, []),
);
```

error:

```
error TS2345: Argument of type '(n: string) => void' is not assignable to parameter of type '(n: number) => void'.
  Types of parameters 'n' and 'n' are incompatible.
    Type 'number' is not assignable to type 'string'.

useFn(wire, 'sample', useCallback((n: string) => {}, []));
                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

up-link wire should have an exact type for each function, but can have more functions.

```ts
interface AB {
  a: (n: number) => void;
  b: (n: string) => void;
}
interface A {
  a: (n: number) => void;
}
interface B {
  b: (n: string) => void;
}
interface C {
  c: (n: string) => void;
}
const wireAB = useWire<Value, AB>(null);
const wireA = useWire<Value, A>(wireAB);
const wireB = useWire<Value, B>(wireAB);
const wireB = useWire<Value, C>(wireAB); // error
```

## Advanced usages

### Global wire

If you want have a global wire you can `createWire` function.

```ts
const themeWire = createWire<'light' | 'dark'>('light');

function SomeComponent() {
  const theme = useWireValue(themeWire);
}
```

### `useSelector` hook

`useSelector` creates and returns a new selector. a selector is a wire with the calculated value.

```ts
const wire = useWire(null, 4);
const selector = useSelector({
  get: ({ get }) => get(wire) * 2,
});

selector.getValue(); // 8
```

You can create a writable selector with passing the `set` option.

```ts
const wire = useWire(null, 4);
const selector = useSelector({
  get: ({ get }) => get(wire) * 2,
  set: ({ set }, value) => set(wire, value / 2),
});

selector.setValue(6);
wire.getValue(); // 3
```

### `createSelector` function

`createSelector` creates a new selector. It can be used outside of the react.

```ts
const themeWire = createWire<'light' | 'dark'>('light');
const textColor = createSelector({
  get: ({ get }) => (get(themeWire) === 'light' ? '#000' : '#fff'),
});

function SomeComponent() {
  const color = useWireValue(textColor);
}
```

### `useSubscribe` hook

Every time the wire value changes, the callback function would be called

```tsx
// subscribe
useSubscribe(
  wire,
  useCallback((value) => {
    /* ... */
  }, []),
);
```

### Subscribe to the wire

Every time the wire value changes, the callback function would be called

<details>
<summary>more detail</summary>

```tsx
// subscribe
const unsubscribe = wire.subscribe((value) => {
  /* ... */
});

// unsubscribe
unsubscribe();
```

</details>

### `useInterceptor` hook

in some rare use-cases you need changing wire behavior and interfering set value. `useInterceptor` helps in these use-cases.

<details>
<summary>more detail</summary>

`useInterceptor` hook gets wire and interceptor function and returns new wire. on every `setValue` of returned wire, the interceptor function gets next value and previous value and returns a new value. the returned value of the interceptor will be set on the wire.

```tsx
const wire = useInterceptor(anotherWire, (nextValue, preValue) => /* anotherValue */)
```

**example**:

```tsx
const valueWire = useInterceptor(
  props.valueWire,
  useCallback(
    (nextValue, preValue) =>
      props.submittingWire.getValue() ? preValue : nextValue,
    [props.submittingWire],
  ),
);
```

</details>

## Notes

### `undefined` value vs `null` value

- `undefined` value means the wire has no value and other wires may set its value during their initialization.
- `null` value means the wire has value and value is `null` and other wires don't override its value during their initialization

### Initial value

During initialization, wire value always has more priority.

- If the up-link wire has value, the initial value will be ignored and respect wire value
- If the up-link wire has `undefined` value, the initial value will be used and wire value will be updated

Examples:

```tsx
const wire1 = useWire(null, 1);
const wire2 = useWire(wire1, 2);

wire1.getValue(); // => 1
wire2.getValue(); // => 1
```

```tsx
const wire1 = useWire(null);
const wire2 = useWire(wire1, 2);

wire1.getValue(); // => 2
wire2.getValue(); // => 2
```

```tsx
const wire = useWire(null, 1);
const [state] = useWireState(wire, 2);

wire.getValue(); // => 1
state; // => 1
```

```tsx
const wire = useWire(null);
const [state] = useWireState(wire, 2);

wire.getValue(); // => 2
state; // => 2
```

### Rewiring

Please avoid changing the wire variable. if wire argument changed, an error will be thrown.

```tsx
// wrong, avoid.
const wire = useWire(condition ? wire1 : wire2);
const value = useWireValue(condition ? wire1 : wire2);
const [state, setState] = useWireState(condition ? wire1 : wire2);
```
