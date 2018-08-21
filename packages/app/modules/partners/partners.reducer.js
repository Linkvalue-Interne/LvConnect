// @flow

import {
  FETCH_PARTNER_START,
  FETCH_PARTNER_SUCCESS,
  FETCH_PARTNERS_START,
  FETCH_PARTNERS_SUCCESS,
} from './partners.actions';

export type PartnersListState = {
  partners: Array<User>,
  pageCount: number,
  page: number,
  limit: number,
  isLoading: boolean,
};

export type EditPartnerState = {
  partner: User | null,
  isLoading: boolean,
};

export type PartnersState = {
  partnersList: PartnersListState,
  editPartner: EditPartnerState,
};

const initialState: PartnersState = {
  partnersList: {
    partners: [],
    limit: 25,
    page: 1,
    pageCount: 0,
    isLoading: false,
  },
  editPartner: {
    partner: null,
    isLoading: false,
  },
};

export default (state: PartnersState = initialState, { type, payload }: ReduxAction): PartnersState => {
  switch (type) {
    case FETCH_PARTNERS_START:
      return {
        ...state,
        partnersList: {
          ...state.partnersList,
          isLoading: true,
          limit: payload.limit,
        },
      };
    case FETCH_PARTNERS_SUCCESS:
      return {
        ...state,
        partnersList: {
          ...state.partnersList,
          partners: (payload.results: Array<User>),
          pageCount: payload.pageCount,
          isLoading: false,
        },
      };
    case FETCH_PARTNER_START:
      return {
        ...state,
        editPartner: {
          partner: null,
          isLoading: true,
        },
      };
    case FETCH_PARTNER_SUCCESS:
      return {
        ...state,
        editPartner: {
          partner: payload,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};
