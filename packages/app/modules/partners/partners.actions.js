// @flow

import qs from 'qs';
import omit from 'lodash.omit';

import type { Dispatch } from 'redux';

import { fetchWithAuth } from '../auth/auth.actions';

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

export const editPartner = (partnerId: string, data: User) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/users/${partnerId}`, {
    method: 'PUT',
    body: omit(data, ['id', 'email', 'createdAt', 'profilePictureUrl']),
  }));

export const deletePartner = (partnerId: string) => (dispatch: Dispatch<ReduxAction>) =>
  dispatch(fetchWithAuth(`/users/${partnerId}`, { method: 'DELETE' }));
