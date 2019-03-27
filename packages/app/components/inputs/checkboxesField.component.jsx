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
  label: string,
  row: boolean,
}

class CheckboxesField extends Component<CheckboxesFieldProps, any> {
  constructor(props: CheckboxesFieldProps) {
    super(props);

    this.state = {
      values: props.input.value || [],
    };
  }

  componentWillReceiveProps(nextProps: CheckboxesFieldProps) {
    const { input } = this.props;
    if (nextProps.input.value !== input.value) {
      this.setState({ values: nextProps.input.value });
    }
  }

  handleChange = (value: string) => (e: any) => {
    const { input } = this.props;
    const { values } = this.state;
    input.onChange(e.target.checked
      ? Array.from(new Set([...values, value]).values())
      : values.filter(val => val !== value));
  };

  render() {
    const { options, meta, label, row, input } = this.props;
    const { values } = this.state;

    return (
      <FormControl component="fieldset" error={meta.touched && !!meta.error}>
        <FormLabel component="legend" required>{label}</FormLabel>
        <FormGroup row={row}>
          {options.map(([value, optionLabel]) => (
            <FormControlLabel
              key={value}
              control={(
                <Checkbox
                  checked={values.includes(value)}
                  onChange={this.handleChange(value)}
                  onBlur={() => input.onBlur()}
                  onFocus={() => input.onFocus()}
                />
              )}
              label={optionLabel}
              data-test-id="checkboxListItem"
            />
          ))}
        </FormGroup>
        <FormHelperText>{meta.touched && meta.error}</FormHelperText>
      </FormControl>
    );
  }
}

export default CheckboxesField;
