// @flow

import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { bindActionCreators } from 'redux';

import type { AppState } from '../../../store/rootReducer';
import type { AppsListState } from '../apps.reducer';

import AppsList from './appsList.page';
import { fetchApps } from '../apps.actions';

type ConnectedAppsListStateProps = AppsListState & {
  user: User | null,
};

type ConnectedAppsListDispatchProps = {
  fetchApps: (options: { page?: number, limit?: number }) => void,
  push: (path: string) => void,
  replace: (path: string) => void,
};

export type ConnectedAppsListProps = AppsListState & ConnectedAppsListDispatchProps;

const mapStateToProps = (state: AppState): ConnectedAppsListStateProps => ({
  ...state.apps.appsList,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ fetchApps, push, replace }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppsList);
