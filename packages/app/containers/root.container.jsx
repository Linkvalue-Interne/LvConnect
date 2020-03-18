// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { renderRoutes } from 'react-router-config';

import type { Store } from 'redux';

import App from './app.container';
import theme from '../modules/display/theme';
import routes from '../config/routes';
import Bar from './bar.container';
import Login from '../modules/auth/pages/login.connector';
import ForgotPassword from '../modules/auth/pages/forgotPassword.connector';


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
            <Route path="/login" component={Login} exact />
            <Route path="/forgot-password" component={ForgotPassword} exact />
            <Route path="/">
              <Bar simple={false} />
              {renderRoutes(routes)}
            </Route>
          </Switch>
        </App>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default hot(module)(Root);
