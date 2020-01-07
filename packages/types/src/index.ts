/**
 * {
 *  reducers: () => ({
 *   这里的方法类型
 *   setList: Reducer
 *  })
 * }
 */
export type Reducer<S, P = any, M = any> = (
  state: S,
  payload: P,
  meta: M
) => void;

/**
 * {
 *  effects: () => ({
 *    这里的方法类型
 *    fetch: Effect
 *  })
 * }
 */
export type Effect<P = any, M = any> = (payload?: P, meta?: M) => any;

export type ReducerMap<S> = {
  [name: string]: Reducer<S>;
};

export type ReducerFcuntion<S> = () => ReducerMap<S>;

export type EffectMap = {
  [name: string]: Effect;
};

export declare type EffectFunction = (params: { dispatch?: any, actionCenter?: any, getState?: any }) => EffectMap;

export type Model<S = any> = {
  state?: S;
  reducers?: ReducerFcuntion<S>;
  effects?: EffectFunction;
};

export type ReviewEffects<E extends EffectMap> = {
  [key in keyof E]: Parameters<E[key]>[0] extends undefined
    ? () => any
    : Parameters<E[key]>[1] extends undefined
    ? (payload: Parameters<E[key]>[0]) => any
    : (payload: Parameters<E[key]>[0], meta: Parameters<E[key]>[1]) => any;
};

export type ReviewReducders<R extends ReducerMap<S>, S> = {
  [key in keyof R]: Parameters<R[key]>[1] extends undefined
    ? () => any
    : Parameters<R[key]>[2] extends undefined
    ? (payload: Parameters<R[key]>[1]) => any
    : (payload: Parameters<R[key]>[1], meta: Parameters<R[key]>[2]) => any;
};

/**
 * 用于获取 actionCenter 中的 reducers
 */
export type ExtractReducerActions<M extends Model> = ReviewReducders<ReturnType<M['reducers']>, ReturnType<M['state']>>;

/**
 * 用于获取 actionCenter 中的 effects
 */
export type ExtractEffectActions<M extends Model> = ReviewEffects<ReturnType<M['effects']>>;

/**
 * 用于调用 effects 和 reducer 的对象
 */
export type ActionCenter<M extends Model> = ExtractReducerActions<M> & ExtractEffectActions<M>;

export type ExcludeTypeAction = {
  [name: string]: any;
};

/**
 * 插件
 */
export type Plugin = {
  /**
   * 用于扩展 model
   * 例如：添加额外的 state、reducers、effects
   */
  extraModel?: Model<any>;
  /**
   * 用于包裹 model
   * 例如：在每个 effect 外加监听
   */
  wrapModel?: (model: Model) => Model;
};

// 设置
export type PluginOptions = {
  /**
   * 插件数组
   */
  plugins: Plugin[];
  /**
   * 错误处理
   */
  onError: (e: Error) => void;
};

export type UseDuraOptions = {
  plugins?: Plugin[];
  onError?: any;
}