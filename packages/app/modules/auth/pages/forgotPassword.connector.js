// @flow

import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import ForgotPassword from './forgotPassword.page';
import { forgotPassword } from '../auth.actions';

type ConnectedForgotPasswordStateProps = {
  isConnected: boolean;
}

type ConnectedForgotPasswordDispatchProps = {
  push(path: string): void;
  forgotPassword(email: string): void;
}

export type ConnectedForgotPasswordProps = ConnectedForgotPasswordStateProps & ConnectedForgotPasswordDispatchProps;

const mapStateToProps = (state: AppState): ConnectedForgotPasswordStateProps => ({
  isConnected: !!state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch): ConnectedForgotPasswordDispatchProps => bindActionCreators({
  push,
  forgotPassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
