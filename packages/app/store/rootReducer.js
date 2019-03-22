// @flow

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { connectRouter } from 'connected-react-router';

import type { AuthState } from '../modules/auth/auth.reducer';
import type { DisplayState } from '../modules/display/display.reducer';
import type { PartnersState } from '../modules/partners/partners.reducer';
import type { AppsState } from '../modules/apps/apps.reducer';
import type { HooksState } from '../modules/hooks/hooks.reducer';
import type { OAuthState } from '../modules/oauth/oauth.reducer';

import auth from '../modules/auth/auth.reducer';
import display from '../modules/display/display.reducer';
import partners from '../modules/partners/partners.reducer';
import apps from '../modules/apps/apps.reducer';
import hooks from '../modules/hooks/hooks.reducer';
import oauth from '../modules/oauth/oauth.reducer';

export type AppState = {
  auth: AuthState,
  display: DisplayState,
  partners: PartnersState,
  apps: AppsState,
  hooks: HooksState,
  oauth: OAuthState,
}

export default (history: History) => combineReducers({
  auth,
  display,
  partners,
  apps,
  hooks,
  oauth,
  form,
  router: connectRouter(history),
});
