import { Dispatch } from 'react';

import originUseDura from '@use-dura/core';
import { createImmerPlugin } from '@use-dura/immer';
import { createLoadingPlugin, ExtractLoadingState } from '@use-dura/loading';
import { ActionCreator, Model } from '@use-dura/types';

function useDura<M extends Model>(model: M): [
  M['state'] & ExtractLoadingState<M>,
  Dispatch<any>,
  ActionCreator<M>,
] {
  const options = {
    plugins: [createImmerPlugin(), createLoadingPlugin(model)],
    onError: e => console.log('error: ', e),
  };
  return originUseDura(model, options);
}

export default useDura;