// @flow

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import type { TextFieldProps } from './textField.component';

import TextField from './textField.component';

type SelectFieldProps = {
  ...TextFieldProps,
  options: Map<string, string>,
};

const SelectField = ({ options, ...props }: SelectFieldProps) => (
  <TextField
    {...props}
    select
  >
    {Array.from(options.entries()).map(([key, value]) => (
      <MenuItem key={key} value={key}>
        {value}
      </MenuItem>
    ))}
  </TextField>
);

export default SelectField;
