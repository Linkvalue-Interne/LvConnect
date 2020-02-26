// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import type { ConnectedAppBarProps } from './appBar.connector';

const styles = theme => ({
  appBar: {
    position: 'absolute',
    width: '100%',
    order: 1,
    zIndex: 100,
  },
  appBarDesktop: {
    marginLeft: theme.custom.drawerWidth,
    width: `calc(100% - ${theme.custom.drawerWidth}px)`,
  },
  flex: {
    flex: 1,
  },
  userDetails: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
  avatar: {
    marginLeft: theme.spacing.unit,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  '@media print': {
    appBar: {
      display: 'none',
    },
  },
});

type AppBarProp = ConnectedAppBarProps & {
  classes: any;
  user?: User;
  logout(): void;
  shouldCollapseBar: boolean;
  simple?: boolean;
  onDrawerOpen(): void;
}

type AppBarState = {
  anchor: any;
  open: boolean;
}

class AppBar extends React.Component<AppBarProp, AppBarState> {
  static defaultProps = {
    user: null,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      anchor: null,
      open: false,
    };
  }

  handleMenuOpen = (event) => {
    this.setState({ open: true, anchor: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    const { logout } = this.props;
    this.setState({ open: false });
    logout(false);
  };

  render() {
    const {
      user,
      classes,
      shouldCollapseBar,
      onDrawerOpen,
      simple,
    } = this.props;
    const { open, anchor } = this.state;
    const collapsed = shouldCollapseBar && user;

    let avatar;
    if ((shouldCollapseBar || simple) && user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      avatar = (
        <div className={classes.userDetails}>
          <Typography color="inherit" data-test-id="appBarFullName">{fullName}</Typography>
          <IconButton color="inherit" onClick={this.handleMenuOpen} className={classes.avatar}>
            <Avatar alt={fullName} src={user.profilePictureUrl} />
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchor}
            open={open}
            onClose={this.handleMenuClose}
          >
            {!simple && (
              <MenuItem
                onClick={this.handleMenuClose}
                component={Link}
                to="/dashboard/my-account"
              >
                Mon compte
              </MenuItem>
            )}
            <MenuItem onClick={this.handleLogout}>Se déconnecter</MenuItem>
          </Menu>
        </div>
      );
    }

    let menuButton;
    if (!shouldCollapseBar && user && !simple) {
      menuButton = (
        <IconButton color="inherit" className={classes.menuButton} onClick={onDrawerOpen}>
          <MenuIcon />
        </IconButton>
      );
    }

    return (
      <MuiAppBar className={`${classes.appBar} ${collapsed ? classes.appBarDesktop : ''}`}>
        <Toolbar>
          {menuButton}
          <Typography variant="h6" color="inherit" className={classes.flex}>
            LVConnect
          </Typography>
          {avatar}
        </Toolbar>
      </MuiAppBar>
    );
  }
}

export default withStyles(styles)(AppBar);
