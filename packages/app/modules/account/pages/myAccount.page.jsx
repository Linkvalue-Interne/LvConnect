// @flow

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import type { ContextRouter } from 'react-router';

import EditPartner from '../../partners/pages/editPartner.connector';
import PasswordChangeCard from '../components/passwordChangeCard.component';

const styles = theme => ({
  passwordChangeCard: {
    marginBottom: theme.spacing.unit * 2,
  },
});

type MyAccountProps = ContextRouter & {
  me: User,
  classes: {
    passwordChangeCard: string,
  },
};

const MyAccount = ({ me, match, classes }: MyAccountProps) => (
  <Fragment>
    <PasswordChangeCard className={classes.passwordChangeCard} askOldPassword />
    <EditPartner
      partnerId={me.id}
      match={match}
      title="Mon compte"
      cardTitle="Editer mes informations"
      autoFocus={false}
    />
  </Fragment>
);

export default withStyles(styles)(MyAccount);
