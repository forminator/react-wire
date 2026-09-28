import { createWire, useWireValue } from '@forminator/react-wire';

const counterWire = createWire(0);

export function App() {
  const count = useWireValue(counterWire);

  return (
    <button type="button" onClick={() => counterWire.setValue(count + 1)}>
      Count: {count}
    </button>
  );
}
