// @flow

import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  notFoundPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  notFoundTitle: {
    fontSize: 150,
    color: theme.palette.grey[200],
    textShadow: `-1px -1px ${theme.palette.grey[300]}`,
  },
});

type NotFoundProps = {
  classes: any,
}

const NotFound = ({ classes }: NotFoundProps) => (
  <div className={classes.notFoundPage}>
    <Typography className={classes.notFoundTitle} variant="h1" component="h1" gutterBottom>404 :(</Typography>
    <Typography className={classes.notFoundBody} variant="h4">
      Oups ! Il semblerait que cette page n{'\''}existe pas/plus
    </Typography>
  </div>
);

export default withStyles(styles)(NotFound);
