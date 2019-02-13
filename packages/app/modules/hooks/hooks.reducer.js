// @flow

import { FETCH_HOOK_START, FETCH_HOOK_SUCCESS, FETCH_HOOKS_START, FETCH_HOOKS_SUCCESS } from './hooks.actions';

export type HooksListState = {
  hooks: Array<Hook>,
  isLoading: boolean,
};

export type EditHookState = {
  hook: Hook | null,
  isLoading: boolean,
};

export type HooksState = {
  hooksList: HooksListState,
  editHook: EditHookState,
};

const initialState: HooksState = {
  hooksList: {
    hooks: [],
    isLoading: false,
  },
  editHook: {
    hook: null,
    isLoading: false,
  },
};

export default (state: HooksState = initialState, { type, payload }: ReduxAction): HooksState => {
  switch (type) {
    case FETCH_HOOKS_START:
      return {
        ...state,
        hooksList: {
          ...state.hooksList,
          isLoading: true,
        },
      };
    case FETCH_HOOKS_SUCCESS:
      return {
        ...state,
        hooksList: {
          ...state.hooksList,
          hooks: (payload.results: Array<Hook>),
          isLoading: false,
        },
      };
    case FETCH_HOOK_START:
      return {
        ...state,
        editHook: {
          hook: null,
          isLoading: true,
        },
      };
    case FETCH_HOOK_SUCCESS:
      return {
        ...state,
        editHook: {
          hook: payload,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};
