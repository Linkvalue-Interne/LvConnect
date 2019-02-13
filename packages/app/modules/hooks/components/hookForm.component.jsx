// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { push } from 'react-router-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import config from '@lvconnect/config/app';

import type { FormProps } from 'redux-form';

import TextField from '../../../components/inputs/textField.component';
import CheckboxField from '../../../components/inputs/checkboxField.component';
import CheckboxesField from '../../../components/inputs/checkboxesField.component';
import hooksLabels from '../hooksLabels';

const events = Object.values(config.hooks.events).map(event => [event, hooksLabels[event] || event]);

const styles = {
  hiddenInput: {
    position: 'absolute',
    visibility: 'hidden',
    right: 0,
  },
};

type HooksFormProps = FormProps & {
  classes: any;
  appId: string;
};

const HookForm = ({ classes, handleSubmit, valid, pristine, children: render }: HooksFormProps) => (
  <form onSubmit={handleSubmit} autoComplete="off">
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
              autoComplete="off"
              component={TextField}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="uri"
              label="Url de notification"
              type="url"
              autoComplete="off"
              component={TextField}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="listeningTo"
              label="Évènements"
              options={events}
              component={CheckboxesField}
            />
          </Grid>
          <Grid item xs={12}>
            <input type="text" name="email" className={classes.hiddenInput} />
            <Field
              name="secret"
              label="Secret"
              autoComplete="off"
              type="password"
              component={TextField}
              required
              minLength={30}
              helperText="
                    Mot de passe qui va servir à sécuriser votre pôint de notification.
                    Il doit contenir au minimum 30 caractères.
                  "
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="active"
              label="Actif"
              type="checkbox"
              component={CheckboxField}
              helperText="Les évènements ne seront envoyés que si votre hook est actif"
            />
          </Grid>
        </Grid>
      ),
    })}
  </form>
);

export default reduxForm({
  form: 'hookForm',
  initialValues: { uri: 'https://', active: true, listeningTo: [] },
  validate: ({ name, uri, secret, listeningTo }) => ({
    name: !name && 'Obligatoire',
    uri: (!uri || !/^https?:\/\/.+$/.test(uri)) && 'Url valide obligatoire',
    secret: (!secret || secret.length < 30) && 'Doit contenir au minimum 30 caractères',
    listeningTo: listeningTo.length === 0 && 'Vous devez sélectionner au moins un évènement',
  }),
  onSubmit: async (formData: any, dispatch: Dispatch<ReduxAction>, { onFormSubmit, appId }: HooksFormProps) => {
    await onFormSubmit({ ...formData, appId });
    dispatch(push(`/dashboard/apps/${appId}`));
  },
})(withStyles(styles)(HookForm));
