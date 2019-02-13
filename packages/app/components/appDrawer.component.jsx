// @flow

import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Apps from '@material-ui/icons/Apps';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import AccountBox from '@material-ui/icons/AccountBox';

import type { ConnectedAppDrawerProps } from './appDrawer.connector';

import AppDrawerItem from './appDrawerItem.component';
import drawerBackground from '../assets/images/drawer-bg.jpg';

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: theme.custom.drawerWidth,
  },
  drawerPaperCollapsed: {
    width: theme.custom.drawerWidth,
    height: '100%',
  },
  drawerHeader: theme.mixins.toolbar,
  '@media print': {
    drawerPaper: {
      display: 'none',
    },
  },
  drawerProfile: {
    background: `url(${drawerBackground}) center no-repeat`,
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

type AppDrawerProps = ConnectedAppDrawerProps & {
  open: boolean;
  onDrawerClose(): void;
  classes: any;
}

const AppDrawer = ({
  user,
  logout,
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
      {user && shouldCollapseDrawer && (
        <div className={classes.drawerProfile}>
          <Avatar src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} />
          <Typography color="inherit" variant="subtitle1" className={classes.fullName}>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography color="inherit">{user.email}</Typography>
        </div>)
      }
      <Divider />
      <List className={classes.linkList}>
        <AppDrawerItem to="/dashboard/partners" icon={<SupervisorAccount />} text="Partners" />
        <AppDrawerItem to="/dashboard/apps" icon={<Apps />} text="Applications" />
      </List>
      {shouldCollapseDrawer && (
        <List disablePadding>
          <Divider />
          <AppDrawerItem to="/dashboard/my-account" icon={<AccountBox />} text="Mon compte" />
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText primary="Se déconnecter" />
          </ListItem>
        </List>
      )}
    </Drawer>
  );
};

export default withStyles(styles)(AppDrawer);
