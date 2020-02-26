// @flow

import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import type { FormProps } from 'redux-form';

import loginTextField from '../../../components/inputs/loginTextField.component';
import { changePassword } from '../../partners/partners.actions';
import CheckboxField from '../../../components/inputs/checkboxField.component';
import keyUrl from '../../../assets/images/key.svg';
import logoUrl from '../../../assets/images/icon.svg';

const styles = theme => ({
  forgotPasswordPage: {
    width: '60%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
  },
  container: {
    position: 'fixed',
    zIndex: 101,
    left: 0,
    top: 0,
    width: '100%',
    height: '100vh',
    margin: '0',
    padding: '0',
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
    marginBottom: '1rem',
    marginTop: '3rem',
    [theme.breakpoints.down('xs')]: {
      width: '25%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '20%',
      marginTop: '1.5rem',
      marginBottom: '.5rem',
    },
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    background: '#FFF',
    margin: '1.5rem 0',
    [theme.breakpoints.down('sm')]: {
      margin: '1rem 0',
    },
  },
  iconInput: {
    position: 'absolute',
    width: '20px',
    top: '50%',
    left: '15px',
    transform: 'translateY(-50%)',
  },
  input: {
    border: 'none',
    outline: 'none',
    width: 'calc(100% - 48px)',
    height: '6vh',
    marginLeft: '3rem',
    fontSize: '.8rem',
    color: '#064F6F',
  },
  submitButton: {
    border: 'none',
    margin: 0,
    width: '100%',
    height: '5vh',
    background: '#5BA0D1',
    color: '#fff',
    fontSize: '.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background .1s ease-in',
    '&:hover': {
      background: '#71CBF4',
    },
  },
  forgotPassword: {
    width: '100%',
    fontSize: '1.5rem',
    textAlign: 'center',
    color: '#064F6F',
    fontFamily: 'Helvetica',
    margin: '2rem 0',
    textTransform: 'none',
    '&:hover': {
      background: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
  },
  supportTextContainer: {
    position: 'fixed',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    top: '93%',
    [theme.breakpoints.down('xs')]: {
      top: '92%',
    },
  },
  supportText: {
    color: '#064F6F',
    fontWeight: 'bold',
    fontSize: '.8rem',
    fontFamily: 'Helvetica',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.5rem',
    },
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

type PasswordChangeCardProps = FormProps & {
  className?: string,
  pkey?: string,
  askOldPassword?: boolean,
  classes: any,
  onPasswordChanged: () => void,
};

const PasswordChangeCard = ({ classes, handleSubmit, askOldPassword, forced, invalid, submitSucceeded }: PasswordChangeCardProps) => (
  <div className={classes.container}>
    <div className={classes.leftContainer} />
    <div className={classes.rightContainer}>
      <img src={logoUrl} alt="Logo LinkValue" className={classes.logoLV} />
      {submitSucceeded ? (
        <h3 className={classes.forgotPassword}>Votre mot de passe a bien été modifié !</h3>
      ) : (
          <>
            <form className={classes.forgotPasswordPage} onSubmit={handleSubmit}>
              <h3 className={classes.forgotPassword}>Changer de mot de passe</h3>
              {forced && (
                <p className={classes.supportText}><strong>Votre mot de passe a expiré, merci de saisir un nouveau mot de passe.</strong></p>
              )}
              <p className={classes.supportText}>Par mesure de sécurité, votre mot de passe ne doit pas contenir votre date de naissance, votre nom ou le nom de votre animal de compagnie. Il doit contenir entre 5 et 30 caractères et de préférence un mix de minuscules, majucules, chiffres et symbols.</p>
              {askOldPassword && (
                <div className={classes.inputContainer}>
                  <img src={keyUrl} alt="Ancien mot de passe" className={classes.iconInput} />
                  <Field className={classes.input} component={loginTextField} type="password" name="oldPassword" label="Ancien mot de passe" placeholder="Ancien mot de passe" data-test-id="passwordChangeOldPasswordInput" min={5} max={30} required autoFocus />
                </div>
              )}
              <div className={classes.inputContainer}>
                <img src={keyUrl} alt="Nouveau mot de passe" className={classes.iconInput} />
                <Field className={classes.input} component={loginTextField} type="password" name="newPassword" label="Nouveau mot de passe" placeholder="Nouveau mot de passe" data-test-id="passwordChangeInput" min={5} max={30} required />
              </div>
              <div className={classes.inputContainer}>
                <img src={keyUrl} alt="Confirmation nouveau mot de passe" className={classes.iconInput} />
                <Field className={classes.input} component={loginTextField} type="password" name="confirmNewPassword" label="Confirmez le nouveau mot de passe" placeholder="Confirmez le nouveau mot de passe" data-test-id="passwordChangeConfirmInput" min={5} max={30} required />
              </div>
              <button className={classes.submitButton} type="submit" disabled={invalid} data-test-id="passwordChangeSubmit">Sauvegarder</button>
              <Button className={classes.backButton} to="/login" component={Link}>Retour ?</Button>
            </form>
            {askOldPassword && (
              <Grid item xs={12}>
                <Field
                  name="cleanupSessions"
                  label="Déconnecter tous les appareils ?"
                  component={CheckboxField}
                />
              </Grid>
            )}
            <div className={classes.supportTextContainer}>
              <p className={classes.supportText}>Un problème ? Contactez l&apos;équipe d&apos;administation !</p>
            </div>
          </>
      )}
    </div>
  </div>
);

export default reduxForm({
  form: 'passwordChange',
  validate: ({ newPassword = '', confirmNewPassword }) => ({
    newPassword: (newPassword.length < 5 || newPassword.length > 30) && 'Doit contenir entre 5 et 30 caractères',
    confirmNewPassword: confirmNewPassword !== newPassword && ' ',
  }),
  onSubmit: async (formData, dispatch, { pkey, onPasswordChanged }) => {
    try {
      const editedUser = await dispatch(changePassword(formData, pkey));
      if (onPasswordChanged) {
        onPasswordChanged(editedUser);
      }
    } catch (e) {
      if (e.status === 401) {
        throw new SubmissionError({
          newPassword: 'Le lien a expiré, appuyez à nouveau sur "Mot de passe oublié" sur l\'écran de connexion',
        });
      }
      if (e.message === 'same_password') {
        throw new SubmissionError({
          newPassword: 'Mot de passe identique à l\'ancien',
        });
      }
      if (e.message === 'invalid_password') {
        throw new SubmissionError({
          oldPassword: 'Mot de passe invalide',
        });
      }
      throw e;
    }
  },
})(withStyles(styles)(PasswordChangeCard));
