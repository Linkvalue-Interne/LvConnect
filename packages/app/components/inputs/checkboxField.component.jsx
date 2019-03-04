// @flow

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import type { FieldProps } from 'redux-form/lib/FieldProps.types.js.flow';

type CheckboxFieldProps = FieldProps & {
  className: string,
  label: string,
  title?: string,
  helperText?: string,
  fullWidth: boolean,
  forceShrink: boolean,
  type: string,
  required: boolean,
};

const CheckboxField = ({
  className,
  input,
  meta,
  label,
  title,
  helperText,
  forceShrink,
  required,
  ...inputProps
}: CheckboxFieldProps) => (
  <FormControl className={className} error={!!meta.error && meta.touched} fullWidth>
    {title && <FormLabel htmlFor={input.name} required={required}>{title}</FormLabel>}
    <FormGroup>
      <FormControlLabel
        control={<Checkbox required={required} {...input} {...inputProps} value="" />}
        label={label}
      />
      <FormHelperText>{(meta.touched && meta.error) || helperText}</FormHelperText>
    </FormGroup>
  </FormControl>
);

export default CheckboxField;
