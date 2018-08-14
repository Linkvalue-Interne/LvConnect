// @flow

import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import LoginRequired from './loginRequired.component';

type ConnectedLoginRequiredStateProps = {
  isConnected: boolean;
  awaitingLogin: boolean;
}

export type ConnectedLoginRequiredProps = ConnectedLoginRequiredStateProps;

const mapStateToProps = (state: AppState): ConnectedLoginRequiredProps => ({
  isConnected: !!state.auth.user,
  awaitingLogin: state.auth.awaitingLogin,
});

export default connect(mapStateToProps)(LoginRequired);
