// @flow

import qs from 'qs';
import omit from 'lodash/omit';

import type { Dispatch } from 'redux';

import { fetchWithAuth } from '../auth/auth.actions';

export const FETCH_APPS_START = 'apps/FETCH_APPS_START';
export const FETCH_APPS_SUCCESS = 'apps/FETCH_APPS_SUCCESS';
export const FETCH_APPS_ERROR = 'apps/FETCH_APPS_ERROR';
export const fetchApps = (params: { page?: number, limit?: number } = { page: 1 }) =>
  async (dispatch: Dispatch<ReduxAction>) => {
    dispatch({ type: FETCH_APPS_START, payload: params });

    try {
      const query = qs.stringify(params);
      const data = await dispatch(fetchWithAuth(`/apps?${query}`));
      dispatch({ type: FETCH_APPS_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: FETCH_APPS_ERROR });
    }
  };

export const isNameDuplicate = (name: string, appId?: string) => async (dispatch: Dispatch<ReduxAction>) => {
  const { results } = await dispatch(fetchWithAuth(`/apps?name=${name}`));
  return !!results && results.filter(app => app.id !== appId).length > 0;
};

export const createNewApp = (data: App) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth('/apps', { method: 'POST', body: data }));

export const FETCH_APP_START = 'apps/FETCH_APP_START';
export const FETCH_APP_SUCCESS = 'apps/FETCH_APP_SUCCESS';
export const FETCH_APP_ERROR = 'apps/FETCH_APP_ERROR';
export const fetchAppDetails = (appId: string) => async (dispatch: Dispatch<ReduxAction>) => {
  dispatch({ type: FETCH_APP_START });

  try {
    const app = await dispatch(fetchWithAuth(`/apps/${appId}`));
    dispatch({ type: FETCH_APP_SUCCESS, payload: app });
  } catch (e) {
    dispatch({ type: FETCH_APP_ERROR });
  }
};

export const editApp = (appId: string, data: App) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/apps/${appId}`, {
    method: 'PUT',
    body: omit(data, ['id', 'allowedGrantTypes', 'appId', 'appSecret']),
  }));

export const deleteApp = (appId: string) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/apps/${appId}`, { method: 'DELETE' }));
