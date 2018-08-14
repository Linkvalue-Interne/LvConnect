// @flow

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
};

type LoadingPageProps = {
  classes: any;
}

const LoadingPage = ({ classes }: LoadingPageProps) => (
  <div className={classes.loaderContainer}>
    <CircularProgress className={classes.progress} size={100} />
  </div>
);

export default withStyles(styles)(LoadingPage);
