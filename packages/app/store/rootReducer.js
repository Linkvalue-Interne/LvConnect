// @flow

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import type { AuthState } from '../modules/auth/auth.reducer';
import type { DisplayState } from '../modules/display/display.reducer';
import type { PartnersState } from '../modules/partners/partners.reducer';

import auth from '../modules/auth/auth.reducer';
import display from '../modules/display/display.reducer';
import partners from '../modules/partners/partners.reducer';

export type AppState = {
  auth: AuthState,
  display: DisplayState,
  partners: PartnersState,
}

export default combineReducers({
  auth,
  display,
  partners,
  form,
});
