import produce from 'immer';
import entries from 'lodash/entries';
import merge from 'lodash/merge';

import { Plugin } from '@use-dura/types';

export const createImmerPlugin = function (): Plugin {
  return {
    wrapModel: (currentModel) => {
      return {
        ...currentModel,
        reducers: () =>
          entries(currentModel.reducers())
            .map(([k, v]) => ({
              [k]: (baseState, payload, meta) => {
                return produce(baseState, draftState => {
                  return v(draftState, payload, meta);
                });
              }
            }))
            .reduce(merge, {})
      };
    }
  };
};