// @flow

import React from 'react';

import type { FieldProps } from 'redux-form/lib/FieldProps.types.js.flow';

export type TextFieldProps = {
  ...FieldProps,
  className: string,
  label: string,
  type: string,
  required: boolean,
  placeholder: string,
  select?: boolean,
  'data-test-id'?: string,
};

const LoginTextField = ({
  className,
  input,
  type,
  select,
  'data-test-id': dataTestId,
  ...props
}: InputProps) => (
  <input
    className={className}
    type={type}
    data-test-id={select ? dataTestId : null}
    {...props}
    {...input}
  />
);

LoginTextField.defaultProps = {
  'data-test-id': null,
};

export default LoginTextField;
