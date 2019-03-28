// @flow

import React from 'react';
import MuiTextField from '@material-ui/core/TextField';

import type { FieldProps } from 'redux-form/lib/FieldProps.types.js.flow';

export type TextFieldProps = {
  ...FieldProps,
  className: string,
  label: string,
  helperText?: string,
  forceShrink: boolean,
  type: string,
  required: boolean,
  placeholder: string,
  multiline: boolean,
  margin?: string,
  select?: boolean,
  'data-test-id'?: string,
};

const TextField = ({
  className,
  input,
  meta,
  margin,
  type,
  helperText,
  select,
  'data-test-id': dataTestId,
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
    InputProps={select ? null : { inputProps: { 'data-test-id': dataTestId } }}
    FormHelperTextProps={typeof dataTestId === 'string' ? { 'data-test-id': `${dataTestId}HelperText` } : null}
    select={select}
    data-test-id={select ? dataTestId : null}
    {...props}
    {...input}
  />
);

TextField.defaultProps = {
  helperText: '',
  margin: 'dense',
  'data-test-id': null,
  select: false,
};

export default TextField;
