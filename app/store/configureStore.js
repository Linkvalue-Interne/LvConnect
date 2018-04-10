// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import type { StoreEnhancer, Store } from 'redux';
import type { AppState } from './rootReducer';

import rootReducer from './rootReducer';

export const browserHistory = createBrowserHistory();

type Compose = (...enhancers: Array<StoreEnhancer<AppState, ReduxAction>>) => StoreEnhancer<AppState, ReduxAction>;

export const configureStore = (): Store<AppState, ReduxAction> => {
  const storeEnhancers = [
    applyMiddleware(thunk, routerMiddleware(browserHistory)),
  ];

  const isProd = process.env.NODE_ENV !== 'production';
  const devToolCompose = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Compose);
  const composeEnhancers: Compose = (isProd && devToolCompose) || (compose: Compose | any);
  return composeEnhancers(...storeEnhancers)(createStore)(rootReducer);
};
