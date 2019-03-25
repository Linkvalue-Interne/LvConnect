// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import type { AppState } from '../../../store/rootReducer';
import type { EditAppState } from '../apps.reducer';

import EditApp from './editApp.page';
import { deleteApp, editApp, fetchAppDetails } from '../apps.actions';

type ConnectedEditAppDispatchProps = {
  fetchAppDetails: (appId: string) => Promise<any>,
  editApp: (appId: string, data: User) => Promise<any>,
  deleteApp: (appId: string) => Promise<any>,
  push: (path: string) => void,
};

export type ConnectedEditAppProps = EditAppState & ConnectedEditAppDispatchProps;

const mapStateToProps = (state: AppState): EditAppState => state.apps.editApp;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchAppDetails,
  editApp,
  deleteApp,
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditApp);
