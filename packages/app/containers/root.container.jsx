// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';

import type { Store } from 'redux';

import App from './app.container';
import theme from '../modules/display/theme';
import Login from '../modules/auth/pages/login.connector';
import LoginRequired from '../modules/auth/components/loginRequired.connector';

type RootProps = {
  store: Store<any, any>;
  history: any;
};

const Root = ({ store, history }: RootProps) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={LoginRequired} />
          </Switch>
        </App>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default hot(module)(Root);
