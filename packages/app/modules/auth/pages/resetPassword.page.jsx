// @flow

import React from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';

import type { ContextRouter } from 'react-router';
import type { ConnectedResetPasswordProps } from './resetPassword.connector';

import PasswordChangeCard from '../../account/components/passwordChangeCard.component';

type ResetPasswordProps = ContextRouter & ConnectedResetPasswordProps;

const ResetPassword = ({ location, push }: ResetPasswordProps) => {
  const { pkey } = qs.parse(location.search.slice(1));
  if (!pkey) {
    return <Redirect to="/login" />;
  }

  return (
    <PasswordChangeCard pkey={pkey} onPasswordChanged={() => push('/login')} />
  );
};

export default ResetPassword;
