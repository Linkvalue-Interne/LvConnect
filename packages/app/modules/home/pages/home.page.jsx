// @flow

import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';

import type { ConnectedHomeProps } from './home.connector';

const Home = ({ user }: ConnectedHomeProps) => user && (
  <Fragment>
    <Typography variant="h3" gutterBottom>Dashboard</Typography>
    <Typography>Hello {user.firstName}! :)</Typography>
  </Fragment>
);

export default Home;
