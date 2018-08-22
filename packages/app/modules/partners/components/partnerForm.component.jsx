// @flow

import React, { Fragment } from 'react';
import { reduxForm, Field, FormSection } from 'redux-form';
import { push } from 'react-router-redux';
import Grid from '@material-ui/core/Grid';
import config from '@lvconnect/config/app';

import type { Dispatch } from 'redux';
import type { FormProps } from 'redux-form';

import TextField from '../../../components/inputs/textField.component';
import RoleCheckboxes from './roleCheckboxes.component';
import CityRadios from './cityRadios.component';
import { isEmailDuplicate } from '../partners.actions';
import SelectField from '../../../components/inputs/selectField.component';
import jobLabels from '../jobLabels';
import { hasRole, RolesConsumer } from '../../../components/restricted.component';

const jobsMap = new Map(Object.entries(jobLabels));

const formatDate = value => (value || '').slice(0, 10);

type PartnerFormProps = FormProps & {
  editMode?: boolean,
  children: (params: { children: any, valid: boolean }) => any,
};

const PartnerForm = ({
  handleSubmit,
  valid,
  pristine,
  editMode,
  children: render,
}: PartnerFormProps) => (
  <form onSubmit={handleSubmit}>
    {render({
      valid,
      pristine,
      children: (
        <RolesConsumer>
          {(userRoles) => {
            const canEdit = hasRole(config.permissions.editUser, userRoles);
            return (
              <Grid container spacing={16}>
                <Grid item md={6} xs={12}>
                  <Field name="firstName" type="text" label="Prénom" component={TextField} required />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field name="lastName" type="text" label="Nom" component={TextField} required />
                </Grid>
                <Grid item xs={12}>
                  <Field name="email" type="email" label="Email" component={TextField} disabled={editMode} required />
                </Grid>
                {canEdit && (
                  <Grid item xs={12}>
                    <Field name="roles" options={Object.entries(config.roles)} component={RoleCheckboxes} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Field name="city" component={CityRadios} />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="job"
                    label="Compétence principale"
                    component={SelectField}
                    required
                    options={jobsMap}
                  />
                </Grid>
                <FormSection name="address" component={Fragment}>
                  <Grid item xs={12}>
                    <Field name="street" type="text" label="Adresse" component={TextField} />
                  </Grid>
                  <Grid item xs={4}>
                    <Field name="zipCode" type="text" label="Code postal" component={TextField} />
                  </Grid>
                  <Grid item xs={8}>
                    <Field name="city" type="text" label="Ville" component={TextField} />
                  </Grid>
                </FormSection>
                <Grid item md={6} xs={12}>
                  <Field
                    name="hiredAt"
                    type="date"
                    format={formatDate}
                    label="Date d'entrée"
                    component={TextField}
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    name="leftAt"
                    type="date"
                    format={formatDate}
                    label="Date de sortie"
                    component={TextField}
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    name="birthDate"
                    type="date"
                    format={formatDate}
                    label="Date de naissance"
                    component={TextField}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Field
                    name="registrationNumber"
                    type="text"
                    label="Matricule"
                    component={TextField}
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field name="description" label="Description" component={TextField} multiline rowsMax="4" />
                </Grid>
              </Grid>
            );
          }}
        </RolesConsumer>
      ),
    })}
  </form>
);

const mandatoryFields = ['firstName', 'lastName', 'email', 'job'];

const validate = values => ({
  ...mandatoryFields.reduce((acc, key) => ({ ...acc, [key]: values[key] ? false : 'Requis' }), {}),
  roles: (values.roles || []).length === 0 ? 'Au moins un rôle doit-être sélectionné' : '',
});

const asyncValidate = async (
  { email },
  dispatch: Dispatch<ReduxAction>,
  { editMode }: PartnerFormProps,
): Promise<void> => {
  if (editMode || !email) {
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
