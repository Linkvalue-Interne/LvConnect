// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';

import LoginRequired from '../modules/auth/components/loginRequired.connector';
import Permissions from '../modules/oauth/components/permissions.connector';
import App from './app.container';
import theme from '../modules/display/theme';
import Bar from './bar.container';

type OAuthProps = {
  store: any,
  history: any,
}

const Oauth = ({ store, history }: OAuthProps) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App simple>
          <Bar simple={false} />
          <LoginRequired>
            <Permissions />
          </LoginRequired>
        </App>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default Oauth;
