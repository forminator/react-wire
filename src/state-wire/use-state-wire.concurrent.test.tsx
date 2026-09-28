import { act, render, screen } from '@testing-library/react';
import { Suspense, use, useDeferredValue } from 'react';
import { describe, expect, it } from 'vitest';
import { createAsyncResource } from '../test/async-resource';
import { ErrorBoundary } from '../test/error-boundary';
import { createStateWire } from './create-state-wire';
import { useStateWire } from './use-state-wire';
import { useWireValue } from './use-wire-value';

describe('useStateWire concurrent rendering', () => {
  it('commits only the latest uplink value after suspended data resolves', async () => {
    const [firstUpLink] = createStateWire({}, 1);
    const [secondUpLink] = createStateWire({}, 2);
    const [upLinkWire] = createStateWire({}, firstUpLink);
    const resource = createAsyncResource<number, number>();
    resource.resolve(1, 1);

    function Consumer() {
      const upLink = useWireValue(upLinkWire);
      const wire = useStateWire(upLink);
      const value = useWireValue(wire);
      const loadedValue = use(resource.get(value));

      return <output>{loadedValue}</output>;
    }

    await act(async () => {
      render(
        <Suspense fallback={<span>loading</span>}>
          <Consumer />
        </Suspense>,
      );
      await resource.get(1);
    });

    expect(await screen.findByRole('status')).toHaveTextContent(/^1$/);

    await act(async () => {
      upLinkWire.setValue(secondUpLink);
    });

    expect(screen.getByText('loading')).toBeVisible();

    await act(async () => {
      secondUpLink.setValue(4);
    });

    expect(screen.getByText('loading')).toBeVisible();

    await act(async () => {
      resource.resolve(2, 2);
      await resource.get(2);
    });

    expect(screen.getByText('loading')).toBeVisible();

    await act(async () => {
      resource.resolve(4, 4);
      await resource.get(4);
    });

    expect(screen.queryByText('loading')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/^4$/);

    act(() => {
      firstUpLink.setValue(5);
    });
    expect(screen.getByRole('status')).toHaveTextContent(/^4$/);

    await act(async () => {
      resource.resolve(6, 6);
      secondUpLink.setValue(6);
      await resource.get(6);
    });
    expect(screen.getByRole('status')).toHaveTextContent(/^6$/);
  });

  it('keeps loaded data stale while the current wire value changes', async () => {
    const [firstUpLink] = createStateWire({}, 1);
    const [secondUpLink] = createStateWire({}, 2);
    const [upLinkWire] = createStateWire({}, firstUpLink);
    const resource = createAsyncResource<number, number>();
    resource.resolve(1, 1);

    function Consumer() {
      const upLink = useWireValue(upLinkWire);
      const wire = useStateWire(upLink);
      const value = useWireValue(wire);
      const deferredValue = useDeferredValue(value);
      const loadedValue = use(resource.get(deferredValue));

      return (
        <>
          <output aria-label="loaded value">{loadedValue}</output>
          <output aria-label="current value">{value}</output>
        </>
      );
    }

    await act(async () => {
      render(
        <Suspense fallback={<span>loading</span>}>
          <Consumer />
        </Suspense>,
      );
      await resource.get(1);
    });

    await screen.findByRole('status', { name: 'loaded value' });
    expectLoadedAndCurrentValues(1, 1);

    await act(async () => {
      upLinkWire.setValue(secondUpLink);
    });

    expect(screen.queryByText('loading')).not.toBeInTheDocument();
    expectLoadedAndCurrentValues(1, 2);

    await act(async () => {
      secondUpLink.setValue(4);
    });

    expect(screen.queryByText('loading')).not.toBeInTheDocument();
    expectLoadedAndCurrentValues(1, 4);

    await act(async () => {
      resource.resolve(4, 4);
      await resource.get(4);
    });

    expectLoadedAndCurrentValues(4, 4);

    act(() => {
      firstUpLink.setValue(5);
    });
    expectLoadedAndCurrentValues(4, 4);
  });

  it('surfaces a rejected promise from the latest uplink', async () => {
    const [firstUpLink] = createStateWire({}, 1);
    const [secondUpLink] = createStateWire({}, 2);
    const [upLinkWire] = createStateWire({}, firstUpLink);
    const resource = createAsyncResource<number, number>();
    resource.resolve(1, 1);

    function Consumer() {
      const upLink = useWireValue(upLinkWire);
      const wire = useStateWire(upLink);
      const value = useWireValue(wire);
      const loadedValue = use(resource.get(value));

      return <output>{loadedValue}</output>;
    }

    await act(async () => {
      render(
        <ErrorBoundary
          fallback={(error) => <div role="alert">{error.message}</div>}
        >
          <Suspense fallback={<span>loading</span>}>
            <Consumer />
          </Suspense>
        </ErrorBoundary>,
        { onCaughtError: () => undefined },
      );
      await resource.get(1);
    });

    expect(await screen.findByRole('status')).toHaveTextContent(/^1$/);

    await act(async () => {
      upLinkWire.setValue(secondUpLink);
    });

    expect(screen.getByText('loading')).toBeVisible();

    await act(async () => {
      resource.reject(2, new Error('failed to load 2'));
    });

    expect(screen.queryByText('loading')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('failed to load 2');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

function expectLoadedAndCurrentValues(loaded: number, current: number) {
  expect(
    screen.getByRole('status', { name: 'loaded value' }),
  ).toHaveTextContent(new RegExp(`^${loaded}$`));
  expect(
    screen.getByRole('status', { name: 'current value' }),
  ).toHaveTextContent(new RegExp(`^${current}$`));
}
