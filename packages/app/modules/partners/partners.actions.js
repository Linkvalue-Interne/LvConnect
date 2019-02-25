// @flow

import qs from 'qs';
import omit from 'lodash/omit';
import config from '@lvconnect/config/app';

import type { Dispatch } from 'redux';
import type { AppState } from '../../store/rootReducer';

import { fetchWithAuth, logout } from '../auth/auth.actions';
import { hasRole } from '../../components/restricted.component';

export const FETCH_PARTNERS_START = 'partners/FETCH_PARTNERS_START';
export const FETCH_PARTNERS_SUCCESS = 'partners/FETCH_PARTNERS_SUCCESS';
export const FETCH_PARTNERS_ERROR = 'partners/FETCH_PARTNERS_ERROR';
export const fetchPartners = (params: { page?: number, limit?: number } = { page: 1 }) =>
  async (dispatch: Dispatch<ReduxAction>) => {
    dispatch({ type: FETCH_PARTNERS_START, payload: params });

    try {
      const query = qs.stringify(params);
      const data = await dispatch(fetchWithAuth(`/users?${query}`));
      dispatch({ type: FETCH_PARTNERS_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: FETCH_PARTNERS_ERROR });
    }
  };

export const CHANGE_ROWS_PER_PAGE = 'partners/CHANGE_ROWS_PER_PAGE';
export const changeRowsPerPage = (limit: number) => ({ type: CHANGE_ROWS_PER_PAGE, payload: { limit } });

export const isEmailDuplicate = (email: string) => async (dispatch: Dispatch<ReduxAction>) => {
  const { results } = await dispatch(fetchWithAuth(`/users?email=${email}`));
  return !!results && results.length > 0;
};

export const createNewPartner = (data: User) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth('/users', { method: 'POST', body: data }));

export const FETCH_PARTNER_START = 'partners/FETCH_PARTNER_START';
export const FETCH_PARTNER_SUCCESS = 'partners/FETCH_PARTNER_SUCCESS';
export const FETCH_PARTNER_ERROR = 'partners/FETCH_PARTNER_ERROR';
export const fetchPartnerDetails = (partnerId: string) => async (dispatch: Dispatch<ReduxAction>) => {
  dispatch({ type: FETCH_PARTNER_START });

  try {
    const partner = await dispatch(fetchWithAuth(`/users/${partnerId}`));
    dispatch({ type: FETCH_PARTNER_SUCCESS, payload: partner });
  } catch (e) {
    dispatch({ type: FETCH_PARTNER_ERROR });
  }
};

export const editPartner = (partnerId: string, data: User) =>
  (dispatch: Dispatch<ReduxAction>, getState: () => AppState) => {
    const state = getState();
    const { user } = state.auth;
    const canEdit = hasRole(config.permissions.editUser, user ? user.roles : []);
    return dispatch(fetchWithAuth(`/users/${partnerId}`, {
      method: 'PUT',
      body: omit(data, ['id', 'email', 'createdAt', 'profilePictureUrl', ...(canEdit ? [] : ['registrationNumber'])]),
    }));
  };

export const deletePartner = (partnerId: string) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/users/${partnerId}`, { method: 'DELETE' }));

type PasswordChange = { oldPassword: string, newPassword: string, cleanupSessions: boolean };
export const changePassword = ({ oldPassword, newPassword, cleanupSessions }: PasswordChange, pkey: string) => (
  async (dispatch: Dispatch<ReduxAction>) => {
    if (pkey) {
      await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': window.CSRF_TOKEN,
          authorization: `Bearer ${pkey}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          cleanupSessions,
        }),
      });
    } else {
      await dispatch(fetchWithAuth('/reset-password', {
        method: 'POST',
        body: {
          oldPassword,
          newPassword,
          cleanupSessions,
        },
      }));
    }

    if (cleanupSessions) {
      dispatch(logout());
    }
  }
);
