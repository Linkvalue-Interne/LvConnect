// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { renderRoutes } from 'react-router-config';

import type { Store } from 'redux';

import App from './app.container';
import theme from '../modules/display/theme';
import routes from '../config/routes';

type RootProps = {
  store: Store<any, any>;
  history: any;
};

const Root = ({ store, history }: RootProps) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App>
          {renderRoutes(routes)}
        </App>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default hot(module)(Root);
