// @flow

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import type { AuthState } from '../modules/auth/auth.reducer';
import type { DisplayState } from '../modules/display/display.reducer';
import type { PartnersState } from '../modules/partners/partners.reducer';
import type { AppsState } from '../modules/apps/apps.reducer';

import auth from '../modules/auth/auth.reducer';
import display from '../modules/display/display.reducer';
import partners from '../modules/partners/partners.reducer';
import apps from '../modules/apps/apps.reducer';

export type AppState = {
  auth: AuthState,
  display: DisplayState,
  partners: PartnersState,
  apps: AppsState,
}

export default combineReducers({
  auth,
  display,
  partners,
  apps,
  form,
});
