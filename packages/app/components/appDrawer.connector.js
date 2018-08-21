// @flow

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { AppState } from '../store/rootReducer';

import AppDrawer from './appDrawer.component';
import { logout } from '../modules/auth/auth.actions';

type ConnectedAppDrawerStateProps = {
  user: User | null;
  shouldCollapseDrawer: boolean;
}

type ConnectedAppDrawerDispatchProps = {
  logout(): void;
}

export type ConnectedAppDrawerProps = ConnectedAppDrawerStateProps & ConnectedAppDrawerDispatchProps;

const mapStateToProps = (state: AppState): ConnectedAppDrawerStateProps => ({
  user: state.auth.user,
  shouldCollapseDrawer: state.display.isMobile || state.display.isTablet,
});

const mapDispatchToProps = (dispatch: Dispatch): ConnectedAppDrawerDispatchProps => bindActionCreators({
  logout,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer);
