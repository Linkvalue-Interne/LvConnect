// @flow

import { combineReducers } from 'redux';

import type { AuthState } from '../modules/auth/auth.reducer';
import type { DisplayState } from '../modules/display/display.reducer';

import auth from '../modules/auth/auth.reducer';
import display from '../modules/display/display.reducer';

export type AppState = {
  auth: AuthState;
  display: DisplayState;
}

export default combineReducers({
  auth,
  display,
});
