// @flow

import qs from 'qs';

import { fetchWithAuth } from '../auth/auth.actions';

export const FETCH_PERMISSIONS_START = 'oauth/FETCH_PERMISSIONS_START';
export const FETCH_PERMISSIONS_SUCCESS = 'oauth/FETCH_PERMISSIONS_SUCCESS';
export const FETCH_PERMISSIONS_ERROR = 'oauth/FETCH_PERMISSIONS_ERROR';
export const fetchPermissions = (params: any) => async (dispatch: Dispatch) => {
  const query = qs.stringify(params);
  dispatch({ type: FETCH_PERMISSIONS_START });
  try {
    const result = await dispatch(fetchWithAuth(`/oauth/permissions?${query}`, {
      headers: {
        'X-CSRF-Token': window.CSRF_TOKEN,
      },
    }));
    dispatch({ type: FETCH_PERMISSIONS_SUCCESS, payload: result });
  } catch (e) {
    dispatch({ type: FETCH_PERMISSIONS_ERROR, payload: e });
  }
};

export const postAuthorize = (params: any, scopes: Array<string>) => async (dispatch: Dispatch) => {
  const query = qs.stringify(params);
  try {
    const { redirectTo } = await dispatch(fetchWithAuth(`/oauth/authorize?${query}`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': window.CSRF_TOKEN,
      },
      body: { scopes },
    }));
    window.location.replace(redirectTo);
  } catch (e) {
    dispatch({ type: FETCH_PERMISSIONS_ERROR, payload: e });
  }
};
