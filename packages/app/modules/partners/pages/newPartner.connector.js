// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewPartner from './newPartner.page';
import { createNewPartner } from '../partners.actions';

type ConnectedNewPartnerDispatchProps = {
  createNewPartner: (data: User) => void,
};

export type ConnectedNewPartnerProps = ConnectedNewPartnerDispatchProps;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  createNewPartner,
}, dispatch);

export default connect(undefined, mapDispatchToProps)(NewPartner);
