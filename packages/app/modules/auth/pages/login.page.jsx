// @flow

import * as React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import type { FormProps } from 'redux-form';
import type { ConnectedLoginProps } from './login.connector';

import LoginTextField from '../../../components/inputs/loginTextField.component';
import logoUrl from '../../../assets/images/icon.svg';
import userUrl from '../../../assets/images/mail.svg';
import keyUrl from '../../../assets/images/key.svg';
import { login } from '../auth.actions';

const styles = theme => ({
  loginPage: {
    width: '55%',
    boxSizing: 'border-box',
    flexGrow: '1',
    [theme.breakpoints.down('sm')]: {
      width: '75%',
    },
  },
  container: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    overflowY: 'auto',
    backgroundColor: '#F8F8F8',
  },
  leftContainer: {
    position: 'fixed',
    backgroundImage: 'linear-gradient(120deg, #71CBF4 0%, #5BA0D1 100%)',
    height: '100vh',
    width: '50%',
    background: 'blue',
    transform: 'skewX(-10deg)',
    left: '-10%',
    [theme.breakpoints.down('lg')]: {
      left: '-20%',
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  rightContainer: {
    width: '55%',
    height: '100vh',
    marginLeft: '45%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: '0',
    },
  },
  logoLV: {
    width: '15%',
    marginBottom: '3rem',
    marginTop: '5rem',
    [theme.breakpoints.down('xs')]: {
      width: '25%',
    },
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    margin: '2rem 0',
  },
  iconInput: {
    position: 'absolute',
    width: '20px',
    top: '50%',
    left: '14px',
    transform: 'translateY(-50%)',
  },
  input: {
    border: 'none',
    outline: 'none',
    width: '100%',
    padding: '14px 14px 14px 48px',
    fontSize: '1rem',
    background: '#FFF',
    color: '#064F6F',
  },
  submitButton: {
    border: 'none',
    margin: 0,
    width: '100%',
    padding: '14px',
    background: '#5BA0D1',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background .1s ease-in',
    '&:hover': {
      background: '#71CBF4',
    },
  },
  forgotPassword: {
    width: '100%',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    background: 'none',
    fontSize: '1rem',
    textAlign: 'center',
    color: '#064F6F',
    textDecoration: 'underline',
    margin: '2rem 0',
    textTransform: 'none',
    '&:hover': {
      background: 'none',
    },
  },
  supportText: {
    color: '#064F6F',
    fontWeight: 'bold',
    fontSize: '1rem',
    fontFamily: 'Helvetica',
    textAlign: 'center',
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
      <div className={classes.container}>
        <div className={classes.leftContainer} />
        <div className={classes.rightContainer}>
          <img src={logoUrl} alt="Logo LinkValue" className={classes.logoLV} />
          <form className={classes.loginPage} onSubmit={handleSubmit}>
            <div className={classes.inputContainer}>
              <img src={userUrl} alt="Mail" className={classes.iconInput} />
              <Field className={classes.input} component={LoginTextField} type="email" name="email" label="Email" placeholder="Email" data-test-id="loginEmailInput" autoFocus />
            </div>
            <div className={classes.inputContainer}>
              <img src={keyUrl} alt="Mot de passe" className={classes.iconInput} />
              <Field className={classes.input} component={LoginTextField} type="password" name="password" label="Mot de passe" placeholder="Mot de passe" data-test-id="loginPasswordInput" required />
            </div>
            <button className={classes.submitButton} type="submit" data-test-id="loginSubmit">Se connecter</button>
            {window.opener
              ? <Button className={classes.forgotPassword} href="/forgot-password" target="_blank" rel="noopener noreferrer">Mot de passe oublié ?</Button>
              : (
                <Button
                  to="/forgot-password"
                  className={classes.forgotPassword}
                  component={Link}
                  data-test-id="forgotPasswordButton"
                >
                  Mot de passe oublié ?
                </Button>
              )}
          </form>
            <p className={classes.supportText}>Un problème ? Contactez l&apos;équipe d&apos;administation !</p>
        </div>
      </div>
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
