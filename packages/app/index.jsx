// @flow

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { configureStore, browserHistory } from './store/configureStore';
import Root from './containers/root.container';

const store = configureStore();

const rootNode = document.querySelector('#root');
if (rootNode) {
  ReactDOM.render(<Root store={store} history={browserHistory} />, rootNode);
}
