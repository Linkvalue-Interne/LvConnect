// @flow

import {
  FETCH_APP_START,
  FETCH_APP_SUCCESS,
  FETCH_APPS_START,
  FETCH_APPS_SUCCESS,
} from './apps.actions';

export type AppsListState = {
  apps: Array<App>,
  pageCount: number,
  page: number,
  limit: number,
  isLoading: boolean,
};

export type EditAppState = {
  app: App | null,
  isLoading: boolean,
};

export type AppsState = {
  appsList: AppsListState,
  editApp: EditAppState,
};

const initialState: AppsState = {
  appsList: {
    apps: [],
    limit: 25,
    page: 1,
    pageCount: 0,
    isLoading: false,
  },
  editApp: {
    app: null,
    isLoading: false,
  },
};

export default (state: AppsState = initialState, { type, payload }: ReduxAction): AppsState => {
  switch (type) {
    case FETCH_APPS_START:
      return {
        ...state,
        appsList: {
          ...state.appsList,
          isLoading: true,
          limit: payload.limit,
        },
      };
    case FETCH_APPS_SUCCESS:
      return {
        ...state,
        appsList: {
          ...state.appsList,
          apps: (payload.results: Array<App>),
          pageCount: payload.pageCount,
          isLoading: false,
        },
      };
    case FETCH_APP_START:
      return {
        ...state,
        editApp: {
          app: null,
          isLoading: true,
        },
      };
    case FETCH_APP_SUCCESS:
      return {
        ...state,
        editApp: {
          app: payload,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};
