// @flow

import React from 'react';
import { withRouter } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import type { ContextRouter } from 'react-router';

const styles = theme => ({
  appRoot: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appContent: {
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    boxSizing: 'border-box',
    overflowY: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  appContentWrapper: {
    paddingBottom: theme.spacing.unit * 5,
  },
  '@global': {
    'html, body, #root': {
      width: '100%',
      height: '100%',
    },
  },
});

type AppProps = {
  ...ContextRouter,
  classes: any;
  children: any;
}

class App extends React.Component<AppProps> {
  render() {
    const { classes, children, simple } = this.props;

    return (
      <div className={classes.appRoot}>
        <CssBaseline />
        <div className={classes.appFrame}>
          <div className={classes.ƒappContent} data-test-id="appContainer">
            <div className={classes.appContentWrapper}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
