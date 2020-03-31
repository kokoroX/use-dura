// import { ActionCreator, Model } from '@use-dura/types';
type Model = {
  state: any;
  reducers?: any;
  effects?: any;
}

function mergeModel<
  M extends Model,
  S extends keyof M['state'],
  // R extends keyof ReturnType<M['reducers']>,
  // E extends keyof ReturnType<M['effects']>,
  >(...args: M[]): {
  state: Required<{ [P in S]: M['state'][P] }>;
  // reducers: () => { [P in R]: ReturnType<M['reducers']>[P] },
  // effects: () => Partial<{ [P in E]: ReturnType<M['effects']>[P] }>
}

function mergeModel(...models) {
  const mergeObj = models.reduce((prev, current) => {
    if (current.state) prev.state.push(current.state);
    if (current.reducers) prev.reducers.push(current.reducers);
    if (current.effects) prev.effects.push(current.effects);
    return prev;
  }, {
    state: [],
    reducers: [],
    effects: [],
  });
  return {
    state: (...args) => mergeObj.state.reduce((prev, current) => ({ ...prev, ...current(...args) }), {}),
    reducers: (...args) => mergeObj.reducers.reduce((prev, current) => ({ ...prev, ...current(...args) }), {}),
    effects: (...args) => mergeObj.effects.reduce((prev, current) => ({ ...prev, ...current(...args) }), {}),
  }
}

const model1 = {
  state: {
    a: 1
  },
  // effects: () => ({
  //   // async demo() {
  //   //   console.log(111);
  //   // }
  // })
}

const model2 = {
  state: {
    a: 1
  },
  // effects: () => ({
  //   async demo(a: number) {
  //     console.log(111);
  //   }
  // })
}

const combine = mergeModel(model1, model2);

// combine.state.
// combine.effects()
