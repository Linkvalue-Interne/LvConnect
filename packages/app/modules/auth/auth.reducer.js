// @flow

import {
  LOGOUT,
  RECEIVE_USER_DATA,
  RECEIVE_USER_DATA_FAILED,
} from './auth.actions';

export type AuthState = {
  user: User | null;
  awaitingLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  awaitingLogin: true,
};

export default (state: AuthState = initialState, { type, payload }: ReduxAction) => {
  switch (type) {
    case LOGOUT:
      return initialState;
    case RECEIVE_USER_DATA:
      return {
        ...state,
        user: (payload: User | typeof undefined),
        awaitingLogin: false,
      };
    case RECEIVE_USER_DATA_FAILED:
      return {
        ...state,
        awaitingLogin: false,
        user: (payload: any).shouldClearUser ? null : state.user,
      };
    default:
      return state;
  }
};
