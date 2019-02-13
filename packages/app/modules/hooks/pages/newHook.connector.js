// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewHook from './newHook.page';
import { createNewHook } from '../hooks.actions';

export type ConnectedNewHookDispatchProps = {
  createNewHook: (data: Hook) => Promise<void>;
}

const mapDispatchToProps = (dispatch: Dispatch): ConnectedNewHookDispatchProps => bindActionCreators({
  createNewHook,
}, dispatch);

export default connect(null, mapDispatchToProps)(NewHook);
