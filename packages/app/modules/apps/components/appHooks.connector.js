// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import type { Dispatch } from 'redux';
import type { AppState } from '../../../store/rootReducer';
import type { HooksListState } from '../../hooks/hooks.reducer';

import AppHooks from './appHooks.components';
import { fetchHooks } from '../../hooks/hooks.actions';

type ConnectedAppHooksDispatchProps = {
  push: (url: string) => void;
  fetchHooks: (appId: string) => any;
};

export type ConnectedAppHooksProps = ConnectedAppHooksDispatchProps & HooksListState;

const mapStateToProps = (state: AppState): HooksListState => state.hooks.hooksList;

const mapDispatchToProps = (dispatch: Dispatch): ConnectedAppHooksDispatchProps => bindActionCreators({
  push,
  fetchHooks,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppHooks);
