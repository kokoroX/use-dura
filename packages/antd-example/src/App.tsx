import 'antd/dist/antd.css';

import { CheckboxOptionType } from 'antd/lib/checkbox';
import { Formik, FormikHelpers } from 'formik';
import { Form, FormItem, Input, Radio, SubmitButton } from 'formik-antd';
import React, { useEffect } from 'react';

import styles from './App.less';
import useDura from './use-dura';

enum Sex {
  Boy = 'Boy',
  Girl = 'Girl',
}

const mockFetchOnceAPi = (id: string) => {
  return new Promise((resolve) => resolve({ name: 'cat', weight: 50, sex: Sex.Boy }));
}

type Pet = {
  name: string;
  weight: number;
  sex: Sex.Boy
}

const initialState = {
  form: {
    name: '',
    weight: 0,
    sex: ''
  }
};
type State = typeof initialState;

const model = {
  state: initialState,
  reducers: () => ({
    setForm: (state: State, payload: Pet) => {
      state.form = payload;
    }
  }),
  effects: ({ actionCenter, dispatch, getState }) => ({
    async fetchPet(id: string) {
      const petRes = await mockFetchOnceAPi(id);
      // 这里的 actionCenter 没有类型提示
      dispatch(actionCenter.setForm(petRes));
    },
    async save(form: State) {
      console.log(form);
    }
  })
}

const sexOptions: CheckboxOptionType[] = [
  { label: '男', value: Sex.Boy },
  { label: '女', value: Sex.Girl },
]

const App = () => {
  const [state, dispatch, actionCenter] = useDura(model);
  useEffect(() => {
    dispatch(actionCenter.fetchPet('id'));
  }, [dispatch]);

  const handleSubmit = (values, formikHelper: FormikHelpers<any>) => {
    dispatch(actionCenter.save(values));
    formikHelper.setSubmitting(false);
  };
  
  return (
    <div className={styles.app}>
      <Formik initialValues={state.form} enableReinitialize onSubmit={handleSubmit}>
        <Form>
          <FormItem label="名字" name="name">
            <Input name="name" />
          </FormItem>
          <FormItem label="体重" name="weight">
            <Input type="number" name="weight" />
          </FormItem>
          <FormItem label="性别" name="sex">
            <Radio.Group name="sex" options={sexOptions} />
          </FormItem>
          <SubmitButton>提交</SubmitButton>
        </Form>
      </Formik>
    </div>
  )
}

export default App;