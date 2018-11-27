// @flow

import * as React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

import type { ContextRouter } from 'react-router';
import type { ConnectedLoginRequiredProps } from './loginRequired.connector';

import LoadingPage from '../../../components/loadingPage.component';
import Home from '../../home/pages/home.connector';
import MyAccount from '../../account/pages/myAccount.connector';
import PartnersList from '../../partners/pages/partnersList.connector';
import NewPartner from '../../partners/pages/newPartner.connector';
import EditPartner from '../../partners/pages/editPartner.connector';
import AppsList from '../../apps/pages/appsList.connector';
import NewApp from '../../apps/pages/newApp.connector';
import EditApp from '../../apps/pages/editApp.connector';
import { RolesProvider } from '../../../components/restricted.component';

type LoginRequiredProps = ConnectedLoginRequiredProps & ContextRouter;

const LoginRequired = ({
  awaitingLogin,
  location,
  user,
}: LoginRequiredProps) => {
  localStorage.setItem('use_new_interface', 'true');

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

  return (
    <RolesProvider value={user.roles}>
      <Switch>
        <Route path="/dashboard/my-account" exact component={MyAccount} />
        <Route path="/dashboard/partners/new" exact component={NewPartner} />
        <Route path="/dashboard/partners/:partnerId" exact component={EditPartner} />
        <Route path="/dashboard/partners" exact component={PartnersList} />
        <Route path="/dashboard/apps/new" exact component={NewApp} />
        <Route path="/dashboard/apps/:appId" exact component={EditApp} />
        <Route path="/dashboard/apps" exact component={AppsList} />
        <Route path="/dashboard" exact component={Home} />
      </Switch>
    </RolesProvider>
  );
};

export default LoginRequired;
