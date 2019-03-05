// @flow

import { FETCH_PERMISSIONS_ERROR, FETCH_PERMISSIONS_START, FETCH_PERMISSIONS_SUCCESS } from './oauth.actions';

type PermissionDetails = {
  application: App,
  permissionsToAllow: Array<string>,
  redirectTo: string,
}

export type OAuthState = {
  error: false | Error,
  loading: boolean,
  result: PermissionDetails | null,
}

const initialState = {
  error: false,
  loading: false,
  result: null,
};

export default (state: OAuthState = initialState, { type, payload }: ReduxAction) => {
  switch (type) {
    case FETCH_PERMISSIONS_START:
      return {
        ...state,
        error: false,
        loading: true,
      };
    case FETCH_PERMISSIONS_SUCCESS:
      return {
        ...state,
        result: payload,
        loading: false,
      };
    case FETCH_PERMISSIONS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};
