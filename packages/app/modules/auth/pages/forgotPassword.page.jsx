// @flow

import * as React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

import type { FormProps } from 'redux-form';
import type { ConnectedForgotPasswordProps } from './forgotPassword.connector';

import LoginTextField from '../../../components/inputs/loginTextField.component';
import mailUrl from '../../../assets/images/mail.svg';
import logoUrl from '../../../assets/images/logoLV.svg';
import { forgotPassword } from '../auth.actions';

const styles = theme => ({
  forgotPasswordPage: {
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
    marginTop: '3.5rem',
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
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#064F6F',
    fontFamily: 'Helvetica',
    margin: '2rem 0',
    textTransform: 'none',
    '&:hover': {
      background: 'none',
    },
  },
  supportText: {
    color: '#064F6F',
    fontWeight: '400',
    fontSize: '1rem',
    fontFamily: 'Helvetica',
    textAlign: 'center',
  },
  backButton: {
    width: '100%',
    color: '#064F6F',
    fontSize: '.8rem',
    fontFamily: 'Helvetica',
    textTransform: 'none',
    textAlign: 'center',
    textDecoration: 'underline',
    marginTop: '1rem',
    '&:hover': {
      background: 'none',
    },
  },
});

type ForgotPasswordProps = ConnectedForgotPasswordProps & {
  ...FormProps,
  classes: any;
};

class ForgotPassword extends React.Component<ForgotPasswordProps> {
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
          <form className={classes.forgotPasswordPage} onSubmit={handleSubmit}>
            <h3 className={classes.forgotPassword}>Mot de passe oublié ?</h3>
            <p className={classes.supportText}>Entrez ci-dessous l&apos;adresse email affiliée à votre compte, un email vous sera envoyé avec un lien permettant de choisir un nouveau mot de passe.</p>
            <div className={classes.inputContainer}>
              <img src={mailUrl} alt="Mail" className={classes.iconInput} />
              <Field className={classes.input} component={LoginTextField} type="email" name="email" label="Email" placeholder="Email" data-test-id="loginEmailInput" autoFocus />
            </div>
            <button className={classes.submitButton} type="submit" data-test-id="forgotPasswordSubmit">Envoyer</button>
            <Button className={classes.backButton} to="/login" component={Link}>Retour ?</Button>
          </form>
          <p className={classes.supportText}>Un problème ? Contactez l&apos;équipe d&apos;administation !</p>
        </div>
      </div>
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
