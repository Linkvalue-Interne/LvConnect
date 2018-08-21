// @flow

import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import type { FormProps } from 'redux-form';

import roleLabels from '../roleLabels';

type RoleCheckboxesProps = FormProps & {
  options: Array<Array<string>>
}

class RoleCheckboxes extends Component<RoleCheckboxesProps, any> {
  constructor(props: RoleCheckboxesProps) {
    super(props);

    this.state = {
      values: props.input.value || [],
    };
  }

  componentWillReceiveProps(nextProps: RoleCheckboxesProps) {
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
    const { options, meta } = this.props;
    const { values } = this.state;

    return (
      <FormControl component="fieldset" error={meta.error}>
        <FormLabel component="legend">Roles</FormLabel>
        <FormGroup row>
          {options.map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={<Checkbox checked={values.includes(value)} onChange={this.handleChange(value)} />}
              label={roleLabels[key] || value}
            />
          ))}
        </FormGroup>
        <FormHelperText>{meta.error}</FormHelperText>
      </FormControl>
    );
  }
}

export default RoleCheckboxes;
