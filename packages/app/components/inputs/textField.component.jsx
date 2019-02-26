// @flow

import React from 'react';
import MuiTextField from '@material-ui/core/TextField';

import type { FieldProps } from 'redux-form/lib/FieldProps.types.js.flow';

export type TextFieldProps = {
  ...FieldProps,
  className: String,
  label: String,
  helperText?: String,
  forceShrink: Boolean,
  type: String,
  required: Boolean,
  placeholder: String,
  multiline: Boolean,
  margin?: String,
};

const TextField = ({
  className,
  input,
  meta,
  margin,
  type,
  helperText,
  ...props
}: TextFieldProps) => (
  <MuiTextField
    className={className}
    fullWidth
    error={meta && !!meta.error && meta.touched}
    helperText={(meta && meta.touched && meta.error) || helperText || ''}
    variant="outlined"
    type={type}
    margin={margin}
    InputLabelProps={{ shrink: type === 'date' ? true : undefined }}
    {...props}
    {...input}
  />
);

TextField.defaultProps = {
  helperText: '',
  margin: 'dense',
};

export default TextField;
