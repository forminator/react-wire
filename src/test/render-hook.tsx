// source: https://github.com/testing-library/react-testing-library/blob/887d95b84ddbcedb46932bf52fbda4518abb35c8/src/pure.js#L118
import { render, act } from '@testing-library/react';
import React, {
  ComponentType,
  createRef,
  Fragment,
  MutableRefObject,
  StrictMode,
  useEffect,
} from 'react';

interface RenderHookResult<Result, Props> {
  rerender: (props: Props) => void;
  result: { current: Result };
  unmount: () => void;
}

interface RenderHookOptions<Props> {
  initialProps: Props;
  wrapper?: ComponentType;
  strict?: boolean;
}

interface RenderHookResultWithoutProps<Result, Props> {
  rerender: () => void;
  result: { current: Result };
  unmount: () => void;
}

interface RenderHookOptionsWithoutProps<Props> {
  wrapper?: ComponentType;
  strict?: boolean;
}

export function renderHook<Result, Props>(
  renderCallback: () => Result,
  options?: RenderHookOptionsWithoutProps<Props>,
): RenderHookResultWithoutProps<Result, Props>;
export function renderHook<Result, Props>(
  renderCallback: (props: Props) => Result,
  options: RenderHookOptions<Props>,
): RenderHookResult<Result, Props>;
export function renderHook<Result, Props>(
  renderCallback: (props?: Props) => Result,
  options: Partial<RenderHookOptions<Props>> = {},
):
  | RenderHookResult<Result, Props>
  | RenderHookResultWithoutProps<Result, Props> {
  const { initialProps, wrapper, strict = true } = options;
  const Wrapper = strict ? StrictMode : Fragment;
  const result: MutableRefObject<Result> = createRef() as MutableRefObject<
    Result
  >;

  function TestComponent({
    renderCallbackProps,
  }: {
    renderCallbackProps?: Props;
  }) {
    const pendingResult = renderCallback(renderCallbackProps);

    useEffect(() => {
      result.current = pendingResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    <Wrapper>
      <TestComponent renderCallbackProps={initialProps} />
    </Wrapper>,
    { wrapper },
  );

  function rerender(rerenderCallbackProps?: Props) {
    return baseRerender(
      <Wrapper>
        <TestComponent renderCallbackProps={rerenderCallbackProps} />
      </Wrapper>,
    );
  }

  return { result, rerender, unmount };
}
export { act };
