// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewApp from './newApp.page';
import { createNewApp } from '../apps.actions';

type ConnectedNewAppDispatchProps = {
  createNewApp: (data: User) => void,
};

export type ConnectedNewAppProps = ConnectedNewAppDispatchProps;

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  createNewApp,
}, dispatch);

export default connect(undefined, mapDispatchToProps)(NewApp);
