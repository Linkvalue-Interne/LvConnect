// @flow

import { DETECT_DEVICE, detectDevice } from './display.actions';

export type DisplayState = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const initialState = {
  ...detectDevice().payload,
};

export default (state: DisplayState = initialState, { type, payload }: ReduxAction): DisplayState => {
  switch (type) {
    case DETECT_DEVICE:
      return { ...state, ...payload };
    default:
      return state;
  }
};
