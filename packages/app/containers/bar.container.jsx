// @flow

import React from 'react';

import AppBar from '../components/appBar.connector';
import AppDrawer from '../components/appDrawer.connector';

type BarProps = {
  simple?: boolean;
}

type BarState = {
  drawerOpen: boolean;
};

class Bar extends React.Component<BarProps, BarState> {
  static defaultProps = {
    simple: false,
  };

  state = {
    drawerOpen: false,
  };

  componentDidUpdate(nextProps: DrawerProps) {
    const { location } = this.props;
    if (location !== nextProps.location) {
      this.setState({ drawerOpen: false });
    }
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { simple } = this.props;
    const { drawerOpen } = this.state;

    return (
      <>
        <AppBar simple={simple} onDrawerOpen={this.handleDrawerOpen} />
        {!simple && <AppDrawer open={drawerOpen} onDrawerClose={this.handleDrawerClose} />}
      </>
    );
  }
}

export default Bar;
