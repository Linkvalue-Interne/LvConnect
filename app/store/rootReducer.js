// @flow

import { combineReducers } from 'redux';

export type AppState = {
  test: string;
}

export default combineReducers({
  test: () => 'foo',
});
