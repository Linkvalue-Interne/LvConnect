// @flow

import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import Login from './login.page';

type ConnectedLoginStateProps = {
  isConnected: boolean;
}

type ConnectedLoginDispatchProps = {
  push(path: string): void;
}

export type ConnectedLoginProps = ConnectedLoginStateProps & ConnectedLoginDispatchProps;

const mapStateToProps = (state: AppState): ConnectedLoginStateProps => ({
  isConnected: !!state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch): ConnectedLoginDispatchProps => bindActionCreators({
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
