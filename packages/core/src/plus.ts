import merge from 'lodash/merge';
import { Dispatch, useMemo } from 'react';

import { ActionCenter, Model, Plugin, UseDuraOptions } from '@use-dura/types';

import { useDura } from './core';

// import { createLoadingPlugin, ExtractLoadingState } from './loading';

/**
 * 
 * @param model Model
 * @param value Plugin
 */
function pluginHandler(model: Model<any>, value: Plugin) {
  let finalModel = model;
  const { wrapModel, extraModel } = value;
  if (wrapModel) {
    finalModel = wrapModel(model);
  }
  
  if (extraModel) {
    const originState = finalModel.state;
    if (extraModel.state) finalModel.state = merge(originState, extraModel.state);
    const originReducers = finalModel.reducers;
    if (extraModel.reducers)
      finalModel.reducers = (...args) => merge(originReducers(...args), extraModel.reducers(...args));
    const originEffects = finalModel.effects;
    if (extraModel.effects)
      finalModel.effects = (...args) => merge(originEffects(...args), extraModel.effects(...args));
  }
  return finalModel;
}

export default function usePlusDura<M extends Model>(model: M, options?: UseDuraOptions) {
  const { plugins = [], onError } = options || {};
  const finalModel = useMemo(() => plugins.reduce(pluginHandler, model), []);
  return useDura(finalModel, onError) as [
    M['state'],
    Dispatch<any>,
    ActionCenter<M>,
  ];
}
