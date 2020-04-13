import React from 'react';
import {
  Input, InputNumber, Checkbox, Button,
} from 'antd';
import {
  Formik, Field, Form, FieldArray,
} from 'formik';
// import { SubmitButton, Form } from 'formik-antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

import * as Yup from 'yup';

const App = () => {
  const defaultField = (name, type, placeholder, Type) => (
    <Field name={name}>
      {({
        field, // { name, value, onChange, onBlur }
        meta,
      }) => (
        <div>
          <Type
            type={type}
            placeholder={placeholder}
            {...field}
            style={{ width: '200px', margin: '5px' }}
          />
          {meta.touched && meta.error && (
            <div className="error" style={{ color: 'red', margin: '5px' }}>{meta.error}</div>
          )}
        </div>
      )}
    </Field>
  );

  const inputText = {
    width: '200px',
    margin: '5px',
    display: 'block',
  };
  const inputAge = {
    width: '60px',
    margin: '5px',
    display: 'block',
  };

  const validSchema = Yup.object({
    name: Yup.string()
      .max(50, 'Must 50 characters or less')
      .required('You must enter Name'),
    password: Yup.string()
      .matches(/^[a-zA-Z0-9]{0,}$/, 'Password have only latin letters and digits')
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .max(40, 'Must be 40 characters or less')
      .matches(/[0-9]+/, 'Password must contain at least one digit')
      .matches(/[A-Z]+/, 'Password must contain an one uppercase character')
      .required('You must enter password'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('You must confirm password'),
    email: Yup.string()
      .email('Invalid email address')
      .required('You must enter email'),
    website: Yup.string().url('Mustbe a valid url'),
    age: Yup.number('Must be an integer')
      .min(18, 'Must be in range of 18 and 65')
      .max(65, 'Must be in range of 18 and 65')
      .required('You must enter your age'),
    skills: Yup.array().of(Yup.string()
      .required('Add a skill or delete field')),
    acceptedTerms: Yup.boolean()
      .required('Required')
      .oneOf([true], 'You must accept the terms and conditions.'),
  });

  return (
    <Formik
      initialValues={{
        name: 'QWe',
        password: '1Qqqqqqqq',
        passwordConfirmation: '1Qqqqqqqq',
        email: 'qwe@mail.ru',
        website: 'http://www.we.ru',
        age: 18,
        skills: [],
        acceptedTerms: false,
      }}
      onSubmit={async (values, actions) => {
        await axios
          .post('http://localhost:3001/sign-up', values)
          .then((res) => {
            if (res.status === 200) {
              alert('Вы успешно зарегестрированы');
              console.log(res);
            }
          })
          .catch((err) => {
            actions.setFieldError('email', 'this email is already exist');
            console.log(err.response);
          });
        alert(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
      }}
      validationSchema={validSchema}
    >
      {(props) => {
        const {
          errors, touched, values, isSubmitting,
        } = props;
        return (
          <Form
            onSubmit={props.handleSubmit}
            style={{
              boxSizing: 'borderBox', width: '300px', margin: 'auto', marginTop: '200px', border: '1px solid gray', padding: '10px', borderRadius: '15px',
            }}
          >
            {defaultField('name', 'input', 'Input Name', Input)}
            {/* <Field name="name" type="input" as={Input} style={inputText} /> */}
            <Field
              name="age"
              type="number"
              as={InputNumber}
              onChange={(v) => {
                props.setFieldValue('age', v);
              }}
              style={inputAge}
            />
            {errors.age && touched.age ? (
              <div style={{ color: 'red', margin: '5px' }}>{errors.age}</div>
            ) : null}
            {defaultField('password', 'password', 'Input password', Input.Password)}
            {/* <Field name="password" type="password" as={Input.Password} style={{width: '200px', margin: '5px'}} /> */}
            <div />
            {defaultField('passwordConfirmation', 'password', 'Confirm password', Input.Password)}
            {/* <Field name="passwordConfirmation" type="password" as={Input.Password} style={{width: '200px', margin: '5px'}} /> */}
            {defaultField('email', 'email', 'email', Input)}
            {defaultField('website', 'url', 'website', Input)}

            {/* Experimental */}

            <FieldArray
              name="skills"
              render={(arrayHelpers) => (
                <div>
                  {values.skills && values.skills.length > 0 ? (
                    values.skills.map((friend, index) => (
                      <div key={index}>
                        <Input
                          placeholder="input skill"
                          name={`skills.${index}`}
                          style={{ display: 'inlineBlock', width: '200px', margin: '5px' }}
                        />
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 10px' }}
                          onClick={
                            () => arrayHelpers.remove(index)
                          }
                        />
                        <PlusOutlined
                          style={{ margin: '0 10px' }}
                          onClick={() => arrayHelpers.insert(index, '')}
                        />
                      </div>
                    ))
                  ) : (
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => arrayHelpers.push('')}
                      style={{ margin: '5px' }}
                    >
                      {/* show this when user has removed all friends from the list */}
                      Add skill
                    </Button>
                  )}
                </div>
              )}
            />
            {/* {errors.skills && touched.skills ? (
            <div style={{color: 'red', margin: '5px', display:'inline'}} >{errors.skills[1]}</div>
          ) : null} */}

            {/* Experimental */}

            {defaultField('acceptedTerms', 'checkbox', 'checked', Checkbox)}
            {/* <Field name="acceptedTerms" type="checkbox" as={Checkbox} style={{display: 'block', margin: '5px'}} /> */}

            <Button
              disabled={isSubmitting}
              type="primary"
              htmlType="submit"
              style={{ display: 'block', margin: '15px', marginLeft: '5px' }}
            >
              Submit
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default App;
