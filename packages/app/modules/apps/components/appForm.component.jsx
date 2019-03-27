// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { push } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import config from '@lvconnect/config/app';

import type { Dispatch } from 'redux';
import type { FormProps } from 'redux-form';

import TextField from '../../../components/inputs/textField.component';
import { isNameDuplicate } from '../apps.actions';
import CheckboxesField from '../../../components/inputs/checkboxesField.component';
import scopesLabels from '../scopesLabels';

const scopes = config.oauth.scopes.map(scope => [scope, scopesLabels[scope] || scope]);

type AppFormProps = FormProps & {
  children: (params: { children: any, valid: boolean }) => any,
};

const AppForm = ({
  handleSubmit,
  valid,
  pristine,
  children: render,
}: AppFormProps) => (
  <form onSubmit={handleSubmit}>
    {render({
      valid,
      pristine,
      children: (
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Field
              name="name"
              type="text"
              label="Nom"
              component={TextField}
              required
              autoFocus
              data-test-id="appNameInput"
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="description"
              label="Description"
              component={TextField}
              multiline
              rowsMax="4"
              required
              data-test-id="appDescriptionInput"
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="redirectUris"
              label="Urls de redirection"
              component={TextField}
              multiline
              rowsMax="4"
              required
              helperText="Chaque url doit être séparée par un retour à la ligne"
              data-test-id="appRedirectUrisInput"
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="allowedScopes"
              label="Scopes"
              options={scopes}
              component={CheckboxesField}
            />
          </Grid>
        </Grid>
      ),
    })}
  </form>
);

const mandatoryFields = ['name', 'description'];

const validate = values => ({
  ...mandatoryFields.reduce((acc, key) => ({ ...acc, [key]: values[key] ? false : 'Requis' }), {}),
  allowedScopes: (values.allowedScopes || []).length === 0 ? 'Au moins un scope doit-être sélectionné' : '',
  redirectUris: (values.redirectUris || []).length === 0 ? 'Au moins une URL de redirection doit être renseignée' : '',
});

const asyncValidate = async (
  { name, id },
  dispatch: Dispatch<ReduxAction>,
): Promise<void> => {
  if (!name) {
    return Promise.resolve();
  }

  let duplicateName;
  try {
    duplicateName = await dispatch(isNameDuplicate(name, id));
  } catch (e) {
    // Do nothing
  }

  if (duplicateName) {
    // eslint-disable-next-line no-throw-literal
    throw { name: 'Nom déjà utilisé' };
  }

  return Promise.resolve();
};

export default reduxForm({
  form: 'app',
  initialValues: {
    allowedScopes: ['profile:get', 'profile:modify'],
  },
  validate,
  asyncValidate,
  asyncBlurFields: ['name'],
  onSubmit: async ({ user, ...formData }: any, dispatch: Dispatch<ReduxAction>, { onFormSubmit }) => {
    await onFormSubmit({
      ...formData,
      redirectUris: formData.redirectUris.split('\n').filter(uri => !!uri),
    });
    dispatch(push('/dashboard/apps'));
  },
})(AppForm);
