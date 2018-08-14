// @flow

export type AuthState = {
  user: User | null;
  awaitingLogin: boolean;
  error: boolean;
}

const initialState: AuthState = {
  user: null,
  awaitingLogin: true,
  error: false,
};

export default (state: AuthState = initialState, { type }: ReduxAction) => {
  switch (type) {
    default:
      return state;
  }
};
