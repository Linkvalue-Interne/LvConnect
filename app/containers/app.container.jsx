// @flow

import React from 'react';
import { withRouter } from 'react-router';
import { CssBaseline, withStyles } from 'material-ui';
import { hot } from 'react-hot-loader';

import type { ContextRouter } from 'react-router';

import AppBar from '../components/appBar.component';
import AppDrawer from '../components/appDrawer.component';

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

type AppState = {
  drawerOpen: boolean;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      drawerOpen: false,
    };
  }

  componentWillReceiveProps(nextProps: AppProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({ drawerOpen: false });
    }
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  }

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  }

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.appRoot}>
        <CssBaseline />
        <div className={classes.appFrame}>
          <AppBar onDrawerOpen={this.handleDrawerOpen} />
          <AppDrawer open={this.state.drawerOpen} onDrawerClose={this.handleDrawerClose} />
          <div className={classes.appContent}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(withRouter(withStyles(styles)(App)));
