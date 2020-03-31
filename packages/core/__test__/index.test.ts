import { act, renderHook } from '@testing-library/react-hooks';

import useDura from '../src';

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

describe('use dura', () => {
  it('only state', () => {
    const model = {
      state: () => ({
        count: 0,
      })
    };
    const { result } = renderHook(() => useDura(model));
    expect(result.current.state.count).toBe(0);
  });

  it('only state and reducers', () => {
    const initialState = {
      count: 0,
    };
    type State = typeof initialState;
    const model = {
      state: () => initialState,
      reducers: () => ({
        increment(state: State){
          return { ...state, count: state.count++ }
        }
      }),
    };
    const { result } = renderHook(() => useDura(model));
    const { dispatch, actionCreator } = result.current;
    act(() => {
      dispatch(actionCreator.increment());
    });
    expect(result.current.state.count).toBe(1);
  });

  it('only effects', async () => {
    const model = {
      effects: () => ({
        async delay(seconds: number) {
          await delay(seconds);
          return 'finished';
        }
      })
    };
    const { result } = renderHook(() => useDura(model));
    const { dispatch, actionCreator } = result.current;
    const res = await dispatch(actionCreator.delay(100));
    expect(res).toBe('finished');
  });

  it('all interaction', async () => {
    const initialState = {
      name: '',
    };
    type State = typeof initialState;
    const model = {
      state: () => initialState,
      reducers: () => ({
        setName(state: State, name: string) {
          state.name = name;
        }
      }),
      effects: ({ dispatch, actionCreator }) => ({
        async fetchName() {
          dispatch(actionCreator.setName('kokoro'));
        }
      })
    };
    const { result } = renderHook(() => useDura(model));
    const { dispatch, actionCreator, state } = result.current;
    await act(async () => {
      await dispatch(actionCreator.fetchName());
    });
    expect(state.name).toBe('kokoro');
  });
})