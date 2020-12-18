// @flow

import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import type { ContextRouter } from 'react-router';
import type { ConnectedLoginRequiredProps } from './loginRequired.connector';

import LoadingPage from '../../../components/loadingPage.component';
import { RolesProvider } from '../../../components/restricted.component';
import PasswordChangeCard from '../../account/components/passwordChangeCard.component';

type LoginRequiredProps = ConnectedLoginRequiredProps & ContextRouter & {
  route: any;
  children: any;
};

const LoginRequired = ({
  awaitingLogin,
  location,
  user,
  route,
  children,
  receiveUserData,
}: LoginRequiredProps) => {
  if (awaitingLogin) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    );
  }

  if (user.needPasswordChange) {
    return (
      <PasswordChangeCard
        forced
        onPasswordChanged={editedUser => receiveUserData(editedUser)}
      />
    );
  }

  return (
    <RolesProvider value={user.roles}>
      {children || renderRoutes(route.routes)}
    </RolesProvider>
  );
};

export default LoginRequired;
