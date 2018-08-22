// @flow

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import type { FieldProps } from 'redux-form/lib/FieldProps.types.js.flow';

type TextFieldProps = FieldProps & {
  className: String,
  label: String,
  helperText?: String,
  fullWidth: Boolean,
  forceShrink: Boolean,
  type: String,
  required: Boolean,
};

const TextField = ({
  className,
  input,
  meta,
  label,
  helperText,
  forceShrink,
  type,
  required,
  ...inputProps
}: TextFieldProps) => (
  <FormControl className={className} error={!!meta.error && meta.touched} fullWidth>
    <InputLabel htmlFor={input.name} shrink={type === 'date' || undefined} required={required}>{label}</InputLabel>
    <Input type={type} {...input} {...inputProps} />
    <FormHelperText>{(meta.touched && meta.error) || helperText}</FormHelperText>
  </FormControl>
);

export default TextField;
