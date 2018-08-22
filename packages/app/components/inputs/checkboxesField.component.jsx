// @flow

import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import type { FormProps } from 'redux-form';

type CheckboxesFieldProps = FormProps & {
  options: Array<Array<string>>,
  label: String,
  row: Boolean,
}

class CheckboxesField extends Component<CheckboxesFieldProps, any> {
  constructor(props: CheckboxesFieldProps) {
    super(props);

    this.state = {
      values: props.input.value || [],
    };
  }

  componentWillReceiveProps(nextProps: CheckboxesFieldProps) {
    if (nextProps.input.value !== this.props.input.value) {
      this.setState({ values: nextProps.input.value });
    }
  }

  handleChange = (value: string) => (e: any) => {
    this.props.input.onChange(e.target.checked ?
      Array.from(new Set([...this.state.values, value]).values()) :
      this.state.values.filter(val => val !== value));
  };

  render() {
    const { options, meta, label, row } = this.props;
    const { values } = this.state;

    return (
      <FormControl component="fieldset" error={meta.error}>
        <FormLabel component="legend" required>{label}</FormLabel>
        <FormGroup row={row}>
          {options.map(([value, optionLabel]) => (
            <FormControlLabel
              key={value}
              control={<Checkbox checked={values.includes(value)} onChange={this.handleChange(value)} />}
              label={optionLabel}
            />
          ))}
        </FormGroup>
        <FormHelperText>{meta.error}</FormHelperText>
      </FormControl>
    );
  }
}

export default CheckboxesField;
