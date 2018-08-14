// @flow

import React from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Home from '@material-ui/icons/Home';
import Apps from '@material-ui/icons/Apps';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';

import AppDrawerItem from './appDrawerItem.component';
// import drawerBackground from '../assets/images/drawer-bg.jpg'

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: theme.custom.drawerWidth,
  },
  drawerPaperCollapsed: {
    height: '100%',
  },
  drawerHeader: theme.mixins.toolbar,
  '@media print': {
    drawerPaper: {
      display: 'none',
    },
  },
  drawerProfile: {
    // background: `url(${drawerBackground}) center no-repeat`,
    backgroundSize: 'cover',
    height: theme.spacing.unit * 17,
    color: theme.palette.common.white,
    boxSizing: 'border-box',
    padding: `${theme.spacing.unit * 2}px`,
  },
  fullName: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    marginTop: theme.spacing.unit * 2,
  },
  linkList: {
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      flex: 1,
      overflowY: 'auto',
    },
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  shouldCollapseDrawer: state.display.isMobile || state.display.isTablet,
});

// const mapDispatchToProps = dispatch => bindActionCreators({
//   logout,
// }, dispatch)

type AppDrawerProps = {
  open: boolean;
  shouldCollapseDrawer: boolean;
  onDrawerClose(): void;
  user: User | null;
  classes: any;
}

const AppDrawer = ({
  user,
  classes,
  open,
  shouldCollapseDrawer,
  onDrawerClose,
  // logout,
}: AppDrawerProps) => {
  const collapsed = shouldCollapseDrawer || !user;
  return (
    <Drawer
      variant={collapsed ? 'temporary' : 'permanent'}
      open={open}
      classes={{ paper: collapsed ? classes.drawerPaperCollapsed : classes.drawerPaper }}
      onClose={onDrawerClose}
    >
      {collapsed ? null : <div className={classes.drawerHeader} />}
      <Hidden mdUp>
        {user && (
          <div className={classes.drawerProfile}>
            <Avatar src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} />
            <Typography color="inherit" variant="subheading" className={classes.fullName}>
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography color="inherit">{user.email}</Typography>
          </div>)
        }
      </Hidden>
      <Divider />
      <List className={classes.linkList}>
        <AppDrawerItem to="/dashboard" icon={<Home />} text="Acceuil" />
        <AppDrawerItem to="/dashboard/partners" icon={<SupervisorAccount />} text="Partners" />
        <AppDrawerItem to="/dashboard/apps" icon={<Apps />} text="Applications" />
      </List>
      <Hidden mdUp>
        <List disablePadding>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText primary="Se déconnecter" />
          </ListItem>
        </List>
      </Hidden>
    </Drawer>
  );
};

export default connect(mapStateToProps)(withStyles(styles)(AppDrawer));
