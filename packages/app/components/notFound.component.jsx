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
  text?: string,
  subText?: string,
  code?: number,
}

const NotFound = ({ code, classes, text, subText }: NotFoundProps) => (
  <div className={classes.notFoundPage} data-test-id="notFound">
    <Typography
      className={classes.notFoundTitle}
      variant="h1"
      component="h1"
      gutterBottom
      data-test-id="notFoundCode"
    >
      {code} :(
    </Typography>
    <Typography className={classes.notFoundBody} variant="h4" gutterBottom data-test-id="notFoundMessage">
      {text}
    </Typography>
    {subText && (
      <Typography className={classes.notFoundBody}>
        {subText}
      </Typography>
    )}
  </div>
);

NotFound.defaultProps = {
  code: 404,
  text: 'Oups ! Il semblerait que cette page n\'existe pas/plus',
  subText: '',
};

export default withStyles(styles)(NotFound);
