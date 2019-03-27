// @flow

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import config from '@lvconnect/config/app';

import type { FormProps } from 'redux-form';

const CityRadios = ({ input, meta }: FormProps) => (
  <FormControl component="fieldset" error={!!meta.error}>
    <FormLabel component="legend" required>Ville</FormLabel>
    <RadioGroup row aria-label="Ville" name="city" value={input.value} onChange={input.onChange}>
      {config.cities.map(city => (
        <FormControlLabel
          key={city}
          value={city}
          control={<Radio />}
          label={city}
          data-test-id="partnerCityRadio"
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default CityRadios;
