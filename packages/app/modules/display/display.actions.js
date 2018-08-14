// @flow

import theme from './theme';

export const DETECT_DEVICE = 'DETECT_DEVICE';
export const detectDevice = () => ({
  type: DETECT_DEVICE,
  payload: {
    isMobile: window.innerWidth <= theme.breakpoints.values.sm,
    isTablet: window.innerWidth > theme.breakpoints.values.sm && window.innerWidth <= theme.breakpoints.values.md,
    isDesktop: window.innerWidth > theme.breakpoints.values.md,
  },
});
