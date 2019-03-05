// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AppState } from '../../../store/rootReducer';

import LoginRequired from './loginRequired.component';
import { receiveUserData } from '../auth.actions';

type ConnectedLoginRequiredStateProps = {
  user: User | null,
  awaitingLogin: boolean,
}

type ConnectedLoginRequiredDispatchProps = {
  receiveUserData: (userData: User) => void,
}

export type ConnectedLoginRequiredProps = ConnectedLoginRequiredStateProps & ConnectedLoginRequiredDispatchProps;

const mapStateToProps = (state: AppState): ConnectedLoginRequiredStateProps => ({
  user: state.auth.user,
  awaitingLogin: state.auth.awaitingLogin,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  receiveUserData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginRequired);
