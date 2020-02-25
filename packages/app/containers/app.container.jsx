// @flow

import React from 'react';
import { withRouter } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import type { ContextRouter } from 'react-router';

import AppBar from '../components/appBar.connector';
import AppDrawer from '../components/appDrawer.connector';

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
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
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
  simple?: boolean;
}

type AppState = {
  drawerOpen: boolean;
};

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    simple: false,
  };

  constructor(props: AppProps) {
    super(props);

    this.state = {
      drawerOpen: false,
    };
  }

  componentWillReceiveProps(nextProps: AppProps) {
    const { location } = this.props;
    if (location !== nextProps.location) {
      this.setState({ drawerOpen: false });
    }
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { classes, children, simple } = this.props;
    const { drawerOpen } = this.state;

    return (
      <div className={classes.appRoot}>
        <CssBaseline />
        <div className={classes.appFrame}>
          <AppBar simple={simple} onDrawerOpen={this.handleDrawerOpen} />
          {!simple && <AppDrawer open={drawerOpen} onDrawerClose={this.handleDrawerClose} />}
          <div className={classes.appContent} data-test-id="appContainer">
            <div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
