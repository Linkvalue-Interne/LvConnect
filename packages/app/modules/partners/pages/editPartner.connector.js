// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AppState } from '../../../store/rootReducer';
import type { EditPartnerState } from '../partners.reducer';

import EditPartner from './editPartner.page';
import { editPartner, fetchPartnerDetails } from '../partners.actions';

type ConnectedEditPartnerDispatchProps = {
  fetchPartnerDetails: (partnerId: string) => void,
  editPartner: (partnerId: string, data: User) => void,
};

export type ConnectedEditPartnerProps = EditPartnerState & ConnectedEditPartnerDispatchProps;

const mapStateToProps = (state: AppState): EditPartnerState => state.partners.editPartner;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchPartnerDetails,
  editPartner,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditPartner);
