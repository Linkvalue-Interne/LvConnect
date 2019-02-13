// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import type { AppState } from '../../../store/rootReducer';
import type { EditHookState } from '../hooks.reducer';

import EditHook from './editHook.page';
import { deleteHook, editHook, fetchHookDetails } from '../hooks.actions';

type ConnectedEditHookDispatchProps = {
  fetchHookDetails: (hookId: string) => Promise<any>,
  editHook: (hookId: string, data: User) => Promise<any>,
  deleteHook: (hookId: string) => Promise<any>,
  push: (path: string) => void,
};

export type ConnectedEditHookProps = EditHookState & ConnectedEditHookDispatchProps;

const mapStateToProps = (state: AppState): EditHookState => state.hooks.editHook;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchHookDetails,
  editHook,
  deleteHook,
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditHook);
