// @flow

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import debounce from 'lodash.debounce';

import { configureStore, browserHistory } from './store/configureStore';
import Root from './containers/root.container';
import { fetchUserData } from './modules/auth/auth.actions';
import { detectDevice } from './modules/display/display.actions';

const store = configureStore();

store.dispatch(fetchUserData());

const handleWindowResize = debounce(() => store.dispatch(detectDevice()), 200);
window.addEventListener('resize', handleWindowResize);

const rootNode = document.querySelector('#root');
if (rootNode) {
  ReactDOM.render(<Root store={store} history={browserHistory} />, rootNode);
}
