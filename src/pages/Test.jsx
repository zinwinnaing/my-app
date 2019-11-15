import React from 'react';
import { reduxForm } from 'redux-form';

const formName = 'adminCreateForm';
const Test = () => {
  return <div>Hello World !</div>;
};

export default reduxForm({ form: formName })(Test);
