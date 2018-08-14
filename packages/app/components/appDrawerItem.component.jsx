// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import type { Element } from 'react';

type AppDrawerItemProps = {
  text: string;
  icon: Element<*>;
  to: string;
}

const AppDrawerItem = ({ text, icon, to }: AppDrawerItemProps) => (
  <ListItem button component={Link} to={to}>
    <ListItemIcon>
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

export default AppDrawerItem;
