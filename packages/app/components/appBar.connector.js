// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AppState } from '../store/rootReducer';

import AppBar from './appBar.component';
import { logout } from '../modules/auth/auth.actions';

type ConnectedAppBarStateProps = {
  user: User | null;
  shouldCollapseBar: boolean;
}

type ConnectedAppBarDispatchProps = {
  logout(): void;
}

export type ConnectedAppBarProps = ConnectedAppBarStateProps & ConnectedAppBarDispatchProps;

const mapStateToProps = (state: AppState): ConnectedAppBarStateProps => ({
  user: state.auth.user,
  shouldCollapseBar: state.display.isDesktop,
});

const mapDispatchToProps = (dispatch: Dispatch): ConnectedAppBarDispatchProps => bindActionCreators({
  logout,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
