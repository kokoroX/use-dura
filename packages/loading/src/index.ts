import entries from 'lodash/entries';
import keys from 'lodash/keys';
import merge from 'lodash/merge';

import { EffectMap, Model, Plugin } from '@use-dura/types';

export const createLoadingPlugin = function (model: Model<any>): Plugin {
  const initialState = {
    loading: {
      global: false,
      effects: keys(model.effects({}))
        .map((ename: string) => ({ [ename]: false }))
        .reduce(merge, {}),
    },
  };

  type State = typeof initialState;

  return {
    wrapModel: (currentModel) => {
      const res = {
        ...currentModel,
        effects: ({ dispatch, ...resetParams }) =>
          entries(currentModel.effects({ dispatch, ...resetParams }))
            .map(([k, v]) => ({
              [k]: async (payload, meta) => {
                const start = () =>
                    dispatch({
                      type: 'loading/startLoading',
                      payload: {
                        effectName: k,
                      },
                    }),
                  end = () =>
                    dispatch({
                      type: 'loading/endLoading',
                      payload: {
                        effectName: k,
                      },
                    });

                if (meta && meta.notLoading) {
                  return await v(payload, meta);
                } else {
                  try {
                    start();
                    const res = await v(payload, meta);
                    end();
                    return res;
                  } catch (error) {
                    end();
                    throw error;
                  }
                }
              },
            }))
            .reduce(merge, {}),
      };

      return res;
    },
    extraModel: {
      state: () => initialState,
      reducers: () => ({
        ['loading/startLoading']: (
          state: State,
          payload: {
            effectName: string;
          },
        ) => {
          return {
            ...state,
            loading: {
              ...state.loading,
              global: true,
              effects: {
                ...state.loading.effects,
                [payload.effectName]: true,
              },
            },
          };
        },
        ['loading/endLoading']: (
          state: State,
          payload: {
            effectName: string;
          },
        ) => {
          const effects = {
            ...state.loading.effects,
            [payload.effectName]: false,
          };
          const global = Object.keys(effects).some(effectName => {
            return effects[effectName];
          });
          return {
            ...state,
            loading: {
              global,
              effects,
            },
          };
        },
      }),
      effects: () => ({}),
    },
  };
};

type ConvertFnToBoolean<E extends EffectMap> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends Model> = {
  loading: {
    global: boolean;
    effects: ConvertFnToBoolean<ReturnType<RMT['effects']>>;
  };
};
