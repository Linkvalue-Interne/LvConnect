// @flow

import { connect } from 'react-redux';

import type { AppState } from '../../../store/rootReducer';

import Home from './home.page';

type ConnectedHomeStateProps = {
  user: User | null;
}

export type ConnectedHomeProps = ConnectedHomeStateProps;

const mapStateToProps = (state: AppState): ConnectedHomeStateProps => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Home);
