import keys from 'lodash/keys';
import merge from 'lodash/merge';
import { Dispatch, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { ActionCreator, Model } from '@use-dura/types';

/**
 * 将 effects 和 reducer 的方法调用转换成 redux 的 Action
 * @param model 
 */
export function extractAction<M extends Model>(model: M): ActionCreator<M> {
  const { reducers, effects } = model;
  return keys(merge(reducers(), effects({})))
    .map((reducerKey: string) => ({
      [reducerKey]: (payload: any, meta: any) => ({
        type: reducerKey,
        payload,
        meta,
      }),
    }))
    .reduce(merge, {});
}

/**
 * 处理 reducer
 * @param model useDura 的 model
 * @param onError 错误处理
 */
function handleModelReducer<M extends Model>(model: M, onError?: any) {
  return (state: M['state'], action: any) => {
    const reducer = model.reducers()[action.type];
    if (!reducer) return state;

    try {
      return reducer(state, action.payload, action.meta);
    } catch (e) {
      onError(e);
      return state;
    }
  };
};

/**
 * useDura 入口
 * @param model state、reducers、effects 集合
 * @param onError 错误处理
 */
export function useDura<M extends Model<any>>(
  model: M,
  onError?: any,
): [M['state'], Dispatch<any>, ActionCreator<M>] {
  const actionCreator = useMemo(() => extractAction(model), [model.effects, model.reducers]);
  const reducer = useMemo(() => handleModelReducer(model, onError), []);
  const [state, originDispatch] = useReducer(reducer, undefined, () => model.state);
  const lastState = useRef(state);
  useEffect(() => {
    lastState.current = state;
  }, [state]);
  const getState = useCallback((() => lastState.current), []);
  const dispatch = useCallback(
    action => {
      const asyncHandlers = model.effects({
        dispatch,
        getState,
        actionCreator,
      });
      const { type } = action || {};
      const asyncHandler = (type && asyncHandlers[type]) || null;
      if (asyncHandler) {
        return asyncHandler(action.payload, action.meta);
      } else {
        return originDispatch(action);
      }
    },
    [model.effects, getState],
  );
  return [state, dispatch, actionCreator];
}
