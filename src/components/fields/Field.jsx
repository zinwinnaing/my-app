import React from 'react';
import PropTypes from 'prop-types';
import { Field as ReduxField } from 'redux-form';
import { FormGroup, ControlLabel, Input } from 'rsuite';
import {
  required,
  number,
  email,
  phoneNumber,
  maxLength255,
} from './validation';

const renderField = fields => {
  const {
    componentClass,
    label,
    placeholder,
    disabled,
    id,
    input,
    type,
    name,
    meta: { touched, error },
    readOnly,
    style,
    labelColor,
  } = fields;
  return (
    <FormGroup className="pt-3 m-0" style={style}>
      <ControlLabel htmlFor={id} style={{ color: labelColor }}>
        {label}
        <span style={{ color: 'red', fontSize: 10 }}>
          {touched && error && ` * ( ${error} )`}
        </span>
      </ControlLabel>

      <Input
        {...input}
        componentClass={componentClass}
        type={type}
        placeholder={placeholder}
        name={name}
        id={id}
        disabled={disabled}
        readOnly={readOnly}
        style={{ minWidth: 0 }}
      />
    </FormGroup>
  );
};

const Field = ({
  isRequired,
  icon,
  label,
  name,
  validateEmail,
  type,
  id,
  componentClass,
  validatePhoneNumber,
  ...rest
}) => {
  const validate = [maxLength255];
  if (isRequired) {
    validate.push(required);
  }
  if (type === 'number') {
    validate.push(number);
  }
  if (validateEmail) {
    validate.push(email);
  }
  if (validatePhoneNumber) {
    validate.push(phoneNumber);
  }
  return (
    <ReduxField
      {...rest}
      icon={icon}
      label={label}
      name={name}
      type={type}
      componentClass={componentClass}
      id={id}
      component={renderField}
      validate={validate}
    />
  );
};

Field.prototype = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOfType([
    'number',
    'text',
    'password',
    'email',
    'checkbox',
    'textarea',
  ]),
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  validateEmail: PropTypes.bool,
};

Field.defaultProps = {
  type: 'text',
  disabled: false,
  isRequired: false,
  validateEmail: false,
};
export default Field;
