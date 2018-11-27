// @flow

import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import MyAccount from './myAccount.page';

type ConnectedMyAccountStateProps = {
  me: User | null,
};

export type ConnectedMyAccountProps = ConnectedMyAccountStateProps;

const mapStateToProps = (state: AppState): ConnectedMyAccountProps => ({
  me: state.auth.user,
});

export default connect(mapStateToProps)(MyAccount);
