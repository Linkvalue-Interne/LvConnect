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

import type { FormProps } from 'redux-form';
import type { ConnectedLoginProps } from './login.connector';

import TextField from '../../../components/inputs/textField.component';
import bgUrl from '../../../assets/images/login-bg.svg';
import logoUrl from '../../../assets/images/logo-lv.svg';
import { login } from '../auth.actions';

const styles = theme => ({
  loginPage: {
    position: 'fixed',
    top: theme.spacing.unit * 6,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    height: `calc(100vh - ${theme.spacing.unit * 6}px)`,
    boxSizing: 'border-box',
    background: `url(${bgUrl}) no-repeat`,
    backgroundSize: 'cover',
    [theme.breakpoints.up('sm')]: {
      top: theme.spacing.unit * 8,
      height: `calc(100vh - ${theme.spacing.unit * 8}px)`,
    },
  },
  loginButtonWrapper: {
    marginTop: theme.spacing.unit * 2,
  },
  logoLV: {
    maxHeight: theme.spacing.unit * 10,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up('sm')]: {
      maxHeight: 'none',
      marginBottom: theme.spacing.unit * 10,
    },
  },
});

type LoginProps = ConnectedLoginProps & {
  ...FormProps,
  classes: any;
};

class Login extends React.Component<LoginProps> {
  componentWillReceiveProps(props) {
    if (props.isConnected) {
      props.push('/dashboard');
    }
  }

  render() {
    const { classes, handleSubmit } = this.props;

    return (
      <form className={classes.loginPage} onSubmit={handleSubmit}>
        <img src={logoUrl} alt="Logo LinkValue" className={classes.logoLV} />
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Connexion
            </Typography>
            <Field
              component={TextField}
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              autoFocus
            />
            <Field
              component={TextField}
              name="password"
              label="Mot de passe"
              type="password"
              fullWidth
              required
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <Button type="submit" color="primary">Se connecter</Button>
            {window.opener
              ? <Button href="/forgot-password" target="_blank" rel="noopener noreferrer">Mot de passe oublié</Button>
              : <Button to="/forgot-password" component={Link}>Mot de passe oublié</Button>}
          </CardActions>
        </Card>
      </form>
    );
  }
}

export default reduxForm({
  form: 'loginForm',
  validate: () => ({}),
  initialValues: { email: '', password: '' },
  onSubmit: async ({ email, password }, dispatch) => {
    try {
      await dispatch(login(email, password));
    } catch (e) {
      if (e.message === 'invalid_user') {
        throw new SubmissionError({ email: ' ', password: 'Email ou mot de passe invalide' });
      }
      if (e.message === 'user_disabled') {
        throw new SubmissionError({ email: ' ', password: 'Ce compte est désactivé' });
      }
      throw e;
    }
  },
})(withStyles(styles)(Login));
