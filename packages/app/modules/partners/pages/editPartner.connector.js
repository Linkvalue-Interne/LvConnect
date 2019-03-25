// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import type { AppState } from '../../../store/rootReducer';
import type { EditPartnerState } from '../partners.reducer';

import EditPartner from './editPartner.page';
import { deletePartner, editPartner, fetchPartnerDetails } from '../partners.actions';

type ConnectedEditPartnerDispatchProps = {
  fetchPartnerDetails: (partnerId: string) => Promise<any>,
  editPartner: (partnerId: string, data: User) => Promise<any>,
  deletePartner: (partnerId: string) => Promise<any>,
  push: (path: string) => void,
};

export type ConnectedEditPartnerProps = EditPartnerState & ConnectedEditPartnerDispatchProps;

const mapStateToProps = (state: AppState): EditPartnerState => state.partners.editPartner;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchPartnerDetails,
  editPartner,
  deletePartner,
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditPartner);
