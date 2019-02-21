// @flow

import qs from 'qs';
import omit from 'lodash/omit';

import type { Dispatch } from 'redux';

import { fetchWithAuth } from '../auth/auth.actions';

export const FETCH_HOOKS_START = 'apps/FETCH_HOOKS_START';
export const FETCH_HOOKS_SUCCESS = 'apps/FETCH_HOOKS_SUCCESS';
export const FETCH_HOOKS_ERROR = 'apps/FETCH_HOOKS_ERROR';
export const fetchHooks = (appId: string) =>
  async (dispatch: Dispatch<ReduxAction>) => {
    dispatch({ type: FETCH_HOOKS_START, payload: { appId } });

    try {
      const query = qs.stringify({ appId });
      const data = await dispatch(fetchWithAuth(`/hooks?${query}`));
      dispatch({ type: FETCH_HOOKS_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: FETCH_HOOKS_ERROR });
    }
  };

export const createNewHook = (data: Hook) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth('/hooks', { method: 'POST', body: data }));

export const FETCH_HOOK_START = 'apps/FETCH_HOOK_START';
export const FETCH_HOOK_SUCCESS = 'apps/FETCH_HOOK_SUCCESS';
export const FETCH_HOOK_ERROR = 'apps/FETCH_HOOK_ERROR';
export const fetchHookDetails = (hookId: string) => async (dispatch: Dispatch<ReduxAction>) => {
  dispatch({ type: FETCH_HOOK_START });

  try {
    const hook = await dispatch(fetchWithAuth(`/hooks/${hookId}`));
    dispatch({ type: FETCH_HOOK_SUCCESS, payload: hook });
  } catch (e) {
    dispatch({ type: FETCH_HOOK_ERROR });
  }
};

export const editHook = ({ id, ...data }: Hook) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/hooks/${id}`, {
    method: 'PUT',
    body: omit(data, ['id', 'appId', 'runs']),
  }));

export const deleteHook = (hookId: string) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/hooks/${hookId}`, { method: 'DELETE' }));
