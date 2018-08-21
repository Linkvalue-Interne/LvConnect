// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { push } from 'react-router-redux';
import Grid from '@material-ui/core/Grid';
import config from '@lvconnect/config/app';

import type { Dispatch } from 'redux';
import type { FormProps } from 'redux-form';

import TextField from '../../../components/inputs/textField.component';
import RoleCheckboxes from './roleCheckboxes.component';
import CityRadios from './cityRadios.component';
import { isEmailDuplicate } from '../partners.actions';

type PartnerFormProps = FormProps & {
  editMode?: boolean,
  children: (params: { children: any, valid: boolean }) => any,
};

const PartnerForm = ({ handleSubmit, valid, pristine, editMode, children: render }: PartnerFormProps) => (
  <form onSubmit={handleSubmit}>
    {render({
      valid,
      pristine,
      children: (
        <Grid container spacing={16}>
          <Grid item md={6} xs={12}>
            <Field
              name="firstName"
              type="text"
              label="Prénom"
              fullWidth
              component={TextField}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Field
              name="lastName"
              type="text"
              label="Nom"
              fullWidth
              component={TextField}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="email"
              type="email"
              label="Email"
              fullWidth
              component={TextField}
              disabled={editMode}
            />
          </Grid>
          <Grid item xs={12}>
            <Field name="roles" options={Object.entries(config.roles)} component={RoleCheckboxes} />
          </Grid>
          <Grid item xs={12}>
            <Field name="city" component={CityRadios} />
          </Grid>
          <Grid item xs={12}>
            <Field name="description" label="Description" component={TextField} fullWidth multiline rowsMax="4" />
          </Grid>
        </Grid>
      ),
    })}
  </form>
);

const validate = values => ({
  ...['firstName', 'lastName', 'email'].reduce((acc, key) => ({ ...acc, [key]: values[key] ? false : 'Requis' }), {}),
  roles: (values.roles || []).length === 0 ? 'Au moins un rôle doit-être sélectionné' : '',
});

const asyncValidate = async (
  { email },
  dispatch: Dispatch<ReduxAction>,
  { editMode }: PartnerFormProps,
): Promise<void> => {
  if (editMode) {
    return Promise.resolve();
  }

  let duplicateEmail;
  try {
    duplicateEmail = await dispatch(isEmailDuplicate(email));
  } catch (e) {
    // Do nothing
  }

  if (duplicateEmail) {
    // eslint-disable-next-line no-throw-literal
    throw { email: 'Email déjà utilisé' };
  }

  return Promise.resolve();
};

export default reduxForm({
  form: 'partner',
  initialValues: {
    roles: [config.roles.TECH],
    city: config.cities[0],
  },
  validate,
  asyncValidate,
  onSubmit: async (formData: User, dispatch: Dispatch<ReduxAction>, { onFormSubmit }) => {
    await onFormSubmit(formData);
    dispatch(push('/dashboard/partners'));
  },
})(PartnerForm);
