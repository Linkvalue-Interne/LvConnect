// @flow

import * as React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';

import type { FormProps } from 'redux-form';
import type { ConnectedForgotPasswordProps } from './forgotPassword.connector';

import TextField from '../../../components/inputs/textField.component';
import bgUrl from '../../../assets/images/login-bg.svg';
import logoUrl from '../../../assets/images/logo-lv.svg';
import { forgotPassword } from '../auth.actions';

const styles = theme => ({
  forgotPasswordPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: `calc(100% + ${theme.spacing.unit * 6}px)`,
    boxSizing: 'border-box',
    background: `url(${bgUrl}) no-repeat`,
    backgroundSize: 'cover',
    margin: -theme.spacing.unit * 3,
  },
  logoLV: {
    marginBottom: theme.spacing.unit * 10,
  },
  forgotPasswordCard: {
    maxWidth: theme.spacing.unit * 60,
  },
});

type ForgotPasswordProps = ConnectedForgotPasswordProps & {
  ...FormProps,
  classes: any;
};

class ForgotPassword extends React.Component<ForgotPasswordProps> {
  componentWillReceiveProps(props) {
    if (props.isConnected) {
      this.props.push('/dashboard');
    }
  }

  render() {
    const { classes, handleSubmit } = this.props;

    return (
      <form className={classes.forgotPasswordPage} onSubmit={handleSubmit}>
        <img src={logoUrl} alt="Logo LinkValue" className={classes.logoLV} />
        <Card className={classes.forgotPasswordCard}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Mot de passe oublié
            </Typography>
            <Typography variant="caption" gutterBottom>
              Entrez ci-dessous {'l\'adresse'} email affiliée à votre compte, un email vous sera envoyé
              avec un lien permettant de choisir un nouveau mot de passe.
            </Typography>
            <Field component={TextField} name="email" label="Email" type="email" fullWidth required />
          </CardContent>
          <CardActions>
            <Button type="submit" color="primary">Envoyer</Button>
            <Button to="/login" component={Link}>Retour</Button>
          </CardActions>
        </Card>
      </form>
    );
  }
}

export default reduxForm({
  form: 'forgotPasswordForm',
  validate: ({ email }) => ({ email: !email && 'Email obligatoire' }),
  onSubmit: async ({ email }, dispatch) => {
    try {
      await dispatch(forgotPassword(email));
      dispatch(push('/login'));
    } catch (e) {
      if (e.message === 'invalid_email') {
        throw new SubmissionError({ email: 'Email invalide' });
      } else {
        throw new SubmissionError({ email: 'Une erreur inconnue s\'est produite' });
      }
    }
  },
})(withStyles(styles)(ForgotPassword));
