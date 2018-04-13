// @flow

import * as React from 'react';
import { Redirect } from 'react-router-dom';

import type { ContextRouter } from 'react-router';
import type { ConnectedLoginRequiredProps } from './loginRequired.connector';

import LoadingPage from '../../../components/loadingPage.component';

type LoginRequiredProps = ConnectedLoginRequiredProps & {
  ...ContextRouter;
  children: any;
};

const LoginRequired = ({
  awaitingLogin,
  isConnected,
  location,
  children,
}: LoginRequiredProps) => {
  if (awaitingLogin) {
    return <LoadingPage />;
  }

  if (!isConnected) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    );
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default LoginRequired;
