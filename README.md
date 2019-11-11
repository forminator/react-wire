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
- [Advanced usages](#advanced-usages)
  - [Subscribe to the wire](#subscribe-to-the-wire)
  - [`useInterceptor` hook](#useinterceptor-hook)
- [Notes](#notes)
  - [`undefined` value vs `null` value](#undefined-value-vs-null-value)
  - [Initial value](#initial-value)
  - [Rewiring](#rewiring)
- [API Docs](#api-docs)

<!-- tocstop -->

## Install

```bash
yarn add @forminator/react-wire
```

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
setState(value => update(value));
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

## Advanced usages

### Subscribe to the wire

Every time wire value changed the callback function will be called

<details>
<summary>more detail</summary>

```tsx
// subscribe
const unsubscribe = wire.subscribe(value => {
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

Please avoid changing the wire variable. rewiring can cause strange behaviors and bad intermediate values

```tsx
// wrong, avoid.
const wire = useWire(condition ? wire1 : wire2);
const value = useWireValue(condition ? wire1 : wire2);
const [state, setState] = useWireState(condition ? wire1 : wire2);
```

## API Docs

[API docs](./docs/api/react-wire.md)
