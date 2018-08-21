// @flow

import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import LoginRequired from './loginRequired.component';

type ConnectedLoginRequiredStateProps = {
  user: User | null,
  awaitingLogin: boolean,
}

export type ConnectedLoginRequiredProps = ConnectedLoginRequiredStateProps;

const mapStateToProps = (state: AppState): ConnectedLoginRequiredProps => ({
  user: state.auth.user,
  awaitingLogin: state.auth.awaitingLogin,
});

export default connect(mapStateToProps)(LoginRequired);
