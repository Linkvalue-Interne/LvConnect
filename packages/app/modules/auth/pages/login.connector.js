// @flow

import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import Login from './login.page';

type ConnectedLoginStateProps = {
  isConnected: boolean;
  error: boolean;
}

type ConnectedLoginDispatchProps = {
  push(path: string): void;
}

export type ConnectedLoginProps = ConnectedLoginStateProps & ConnectedLoginDispatchProps;

const mapStateToProps = (state: AppState) => ({
  isConnected: !!state.auth.user,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch: Dispatch): ConnectedLoginDispatchProps => bindActionCreators({
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
