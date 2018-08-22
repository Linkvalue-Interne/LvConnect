// @flow

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

type SelectFieldProps = {
  label: String,
  options: Map<string, string>,
  input: any,
  meta: any,
  required: Boolean,
  native: Boolean,
};

const SelectField = ({ label, options, input, meta, required, native }: SelectFieldProps) => (
  <FormControl fullWidth>
    <InputLabel required={required} htmlFor={input.name}>{label}</InputLabel>
    <Select
      native={native}
      value={input.value}
      inputProps={{ ...input, id: input.name }}
      error={!!meta.error && meta.touched}
    >
      {Array.from(options.entries()).map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
    </Select>
  </FormControl>
);

export default SelectField;
