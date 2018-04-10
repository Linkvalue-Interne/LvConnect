// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import type { Store } from 'redux';

import App from './app.container';

type RootProps = {
  store: Store<any, any>;
  history: any;
};

const Root = ({ store, history }: RootProps) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

export default Root;
