// @flow

import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui';
import { Link } from 'react-router-dom';

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
