// @flow

import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import ResetPassword from './resetPassword.page';

type ConnectedResetPasswordDispatchProps = {
  push(path: string): void;
}

export type ConnectedResetPasswordProps = ConnectedResetPasswordDispatchProps;

const mapDispatchToProps = (dispatch: Dispatch): ConnectedResetPasswordDispatchProps => bindActionCreators({
  push,
}, dispatch);

export default connect(null, mapDispatchToProps)(ResetPassword);
