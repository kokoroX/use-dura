## useDura

### 介绍
脱胎于 [dura](https://github.com/ityuany/dura)

### 使用
```js
const model = {
  state: initialState,
  reducers: () => ({
    setForm: (state: State, payload: Pet) => {
      state.form = payload;
    }
  }),
  effects: ({ actionCenter, dispatch, getState }) => ({
    async fetchPet(id: string) {
      const res = await api(id);
      // 这里的 actionCenter 没有类型提示
      dispatch(actionCenter.setForm(res));
    },
    async save(form: State) {
      console.log(form);
    }
  })
}
const App = () => {
  const [state, dispatch, actionCenter] = useDura(model);
  useEffect(() => {
    dispatch(actionCenter.fetchPet('id'));
  }, [dispatch]);

  const handleSubmit = (values, formikHelper: FormikHelpers<any>) => {
    dispatch(actionCenter.save(values));
    formikHelper.setSubmitting(false);
  };
  return <div></div>
}
```


### TODO
- [] Taro 例子添加
- [] Taro 版本输出
- [] 补全测试用例