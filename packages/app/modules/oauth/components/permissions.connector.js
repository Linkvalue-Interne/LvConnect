// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AppState } from '../../../store/rootReducer';

import Permissions from './permissions.component';
import { fetchPermissions, postAuthorize } from '../oauth.actions';
import type { OAuthState } from '../oauth.reducer';

type ConnectedPermissionsDispatchProps = {
  fetchPermissions: (params: any) => void,
  postAuthorize: (params: any, permissions: Array<string>) => void,
}

export type ConnectedPermissionsProps = OAuthState & ConnectedPermissionsDispatchProps;

const mapStateToProps = (state: AppState): OAuthState => state.oauth;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchPermissions,
  postAuthorize,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
