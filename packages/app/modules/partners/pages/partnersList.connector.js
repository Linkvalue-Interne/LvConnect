// @flow

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';

import type { AppState } from '../../../store/rootReducer';
import type { PartnersListState } from '../partners.reducer';

import PartnersList from './partnersList.page';
import { changeRowsPerPage, fetchPartners } from '../partners.actions';

type ConnectedPartnersListStateProps = PartnersListState & {
  user: User | null,
};

type ConnectedPartnersListDispatchProps = {
  fetchPartners: (options: { page?: number, limit?: number }) => void,
  push: (path: string) => void,
  changeRowsPerPage: () => void,
};

export type ConnectedPartnersListProps = PartnersListState & ConnectedPartnersListDispatchProps;

const mapStateToProps = (state: AppState): ConnectedPartnersListStateProps => ({
  ...state.partners.partnersList,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchPartners,
  changeRowsPerPage,
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PartnersList);
