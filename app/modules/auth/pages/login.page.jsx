// @flow

import * as React from 'react';
import { Card, CardContent, Typography, withStyles } from 'material-ui';

import type { ConnectedLoginProps } from './login.connector';

// import { lvConnect } from '../lvconnect'
import bgUrl from '../../../assets/images/login-bg.svg';
import logoUrl from '../../../assets/images/logo-lv.svg';

const styles = theme => ({
  loginPage: {
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
  loginButtonWrapper: {
    marginTop: theme.spacing.unit * 2,
  },
  logoLV: {
    marginBottom: theme.spacing.unit * 10,
  },
});

type LoginProps = ConnectedLoginProps & {
  classes: any;
};

class Login extends React.Component<LoginProps> {
  componentDidMount() {
    // lvConnect.mountLoginButton(this.loginButtonContainer)
  }

  componentWillReceiveProps(props) {
    if (props.isConnected) {
      this.props.push('/');
    }
  }

  getLoginButtonCointerRef = (el: any): void => {
    this.loginButtonContainer = el;
  }

  loginButtonContainer: HTMLElement | null;

  render() {
    const { classes, error } = this.props;

    return (
      <div className={classes.loginPage}>
        <img src={logoUrl} alt="Logo LinkValue" className={classes.logoLV} />
        <Card>
          <CardContent>
            <Typography variant="headline" component="h2" gutterBottom>
              Bienvenue sur CraCra
            </Typography>
            <div className={classes.loginButtonWrapper} ref={this.getLoginButtonCointerRef} />
            {error ? <Typography color="error">An error occurred during login</Typography> : null}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
