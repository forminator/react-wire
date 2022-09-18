import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import React, { Fragment, PropsWithChildren, useEffect, useState } from 'react';
import { useSelector } from './selector/use-selector';
import { useWireValue } from './state-wire/use-wire-value';
import { renderHook } from './test/render-hook';
import { useWire } from './wire/use-wire';

// the act function is not as same as click event, so we use fire event instead of act
const Wrapper = (props: PropsWithChildren<{ onClick: () => void }>) => {
  const { children } = props;
  return (
    <Fragment>
      <button onClick={props.onClick}>click</button>
      {children}
    </Fragment>
  );
};

describe('sync with use state', function () {
  describe('wire', function () {
    it('should updated in sync with react useState', function () {
      const onClick = () => {
        result.current.wire.setValue(1);
        result.current.setValue(1);
      };
      const wrapper = (props: PropsWithChildren<{}>) => {
        const { children } = props;

        return <Wrapper onClick={onClick}>{children}</Wrapper>;
      };
      const { result } = renderHook(
        () => {
          const wire = useWire(null, 0);
          const wireValue = useWireValue(wire);
          const [value, setValue] = useState(0);
          useEffect(() => {
            expect(wireValue).toBe(value);
          });
          return { wire, setValue };
        },
        { wrapper },
      );
      fireEvent.click(screen.getByText('click'));
    });
  });
  describe('selector', function () {
    it('should updated in sync with react useState', function () {
      const onClick = () => {
        result.current.wire.setValue(1);
        result.current.setValue(1);
      };
      const wrapper = (props: PropsWithChildren<{}>) => {
        const { children } = props;

        return <Wrapper onClick={onClick}>{children}</Wrapper>;
      };
      const { result } = renderHook(
        () => {
          const wire = useWire(null, 0);
          const selector = useSelector({ get: ({ get }) => get(wire) * 2 });
          const selectorValue = useWireValue(selector);
          const [value, setValue] = useState(0);
          useEffect(() => {
            expect(selectorValue).toBe(value * 2);
          });
          return { wire, setValue };
        },
        { wrapper },
      );
      fireEvent.click(screen.getByText('click'));
    });
  });
});
