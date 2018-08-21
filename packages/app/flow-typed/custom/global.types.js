// @flow

import type { Dispatch } from 'redux';

declare type ReduxAction = ((dispatch: Dispatch<ReduxAction>) => any) | {
  type: string;
  payload?: any;
};
