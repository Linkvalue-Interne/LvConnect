// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import type { FormProps } from 'redux-form';

import TextField from '../../../components/inputs/textField.component';
import { changePassword } from '../../partners/partners.actions';
import CheckboxField from '../../../components/inputs/checkboxField.component';

type PasswordChangeCardProps = FormProps & {
  className?: string,
  pkey?: string,
  askOldPassword?: boolean,
  onPasswordChanged: () => void,
};

const PasswordChangeCard = ({ className, handleSubmit, askOldPassword }: PasswordChangeCardProps) => (
  <form onSubmit={handleSubmit}>
    <Card className={className}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Changer de mot de passe
        </Typography>
        <Grid container spacing={16}>
          {askOldPassword && (
            <Grid item xs={12}>
              <Field
                name="oldPassword"
                type="password"
                label="Ancien mot de passe"
                component={TextField}
                required
              />
            </Grid>
          )}
          <Grid item md={6} xs={12}>
            <Field
              name="newPassword"
              type="password"
              label="Nouveau mot de passe"
              component={TextField}
              required
              min={5}
              max={30}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Field
              name="confirmNewPassword"
              type="password"
              label="Confirmer le nouveau mot de passe"
              component={TextField}
              required
              min={5}
              max={30}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">
              <b>Rappel</b>: Par mesure de sécurité, votre mot de passe ne doit pas contenir votre date de naissance,
              votre nom ou le nom de votre animal de compagnie. Il doit contenir entre 5 et 30 caractères et de
              préférence un mix de minuscules, majucules, chiffres et symbols.
            </Typography>
          </Grid>
          {askOldPassword && (
            <Grid item xs={12}>
              <Field
                name="cleanupSessions"
                label="Forcer tous les appareils à se reconnecter"
                component={CheckboxField}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" type="submit">Sauvegarder</Button>
      </CardActions>
    </Card>
  </form>
);

export default reduxForm({
  form: 'passwordChange',
  validate: ({ newPassword = '', confirmNewPassword }) => ({
    newPassword: (newPassword.length < 5 || newPassword.length > 30) && 'Doit contenir entre 5 et 30 caractères',
    confirmNewPassword: confirmNewPassword !== newPassword,
  }),
  onSubmit: async (formData, dispatch, { pkey, onPasswordChanged }) => {
    await dispatch(changePassword(formData, pkey));
    if (onPasswordChanged) {
      onPasswordChanged();
    }
  },
})(PasswordChangeCard);
