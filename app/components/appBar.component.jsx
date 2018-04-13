// @flow

import * as React from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon } from 'material-ui-icons';
import {
  AppBar as MuiAppBar,
  IconButton,
  Hidden,
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  withStyles,
} from 'material-ui';

// import { logout } from '../modules/auth/auth.actions';

const styles = theme => ({
  appBar: {
    position: 'absolute',
    width: '100%',
    order: 1,
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

const mapStateToProps = state => ({
  user: state.auth.user,
  shouldCollapseBar: state.display.isDesktop,
});

// const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch);

type AppBarProp = {
  classes: any;
  user?: User;
  logout(): void;
  shouldCollapseBar: boolean;
  onDrawerOpen(): void;
}

type AppBarState = {
  anchor: any;
  open: boolean;
}

class AppBar extends React.Component<AppBarProp, AppBarState> {
  static defaultProps = {
    user: null,
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      anchor: null,
      open: false,
    };
  }

  handleMenuOpen = (event) => {
    this.setState({ open: true, anchor: event.currentTarget });
  }

  handleMenuClose = () => {
    this.setState({ open: false });
  }

  handleLogout = () => {
    this.setState({ open: false });
    this.props.logout();
  }

  render() {
    const {
      user, classes, shouldCollapseBar, onDrawerOpen,
    } = this.props;
    const collapsed = shouldCollapseBar && user;

    let avatar;
    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      avatar = (
        <div className={classes.userDetails}>
          <Hidden mdDown>
            {fullName}
            <IconButton color="inherit" onClick={this.handleMenuOpen} className={classes.avatar}>
              <Avatar alt={fullName} src={user.profilePictureUrl} />
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={this.state.anchor}
              open={this.state.open}
              onClose={this.handleMenuClose}
            >
              <MenuItem component={Link} to="/settings" onClick={this.handleMenuClose}>Paramètres</MenuItem>
              <MenuItem onClick={this.handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </Hidden>
        </div>
      );
    }

    let menuButton;
    if (!shouldCollapseBar && user) {
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
          <Typography variant="title" color="inherit" className={classes.flex}>
            LV Connect
          </Typography>
          {avatar}
        </Toolbar>
      </MuiAppBar>
    );
  }
}

export default connect(mapStateToProps /* , mapDispatchToProps */)(withStyles(styles)(AppBar));
