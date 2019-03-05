import React from 'react';
import { Redirect } from 'react-router-dom';

import MyAccount from '../modules/account/pages/myAccount.connector';
import NewPartner from '../modules/partners/pages/newPartner.connector';
import EditPartner from '../modules/partners/pages/editPartner.connector';
import PartnersList from '../modules/partners/pages/partnersList.connector';
import NewApp from '../modules/apps/pages/newApp.connector';
import NewHook from '../modules/hooks/pages/newHook.connector';
import EditHook from '../modules/hooks/pages/editHook.connector';
import EditApp from '../modules/apps/pages/editApp.connector';
import AppsList from '../modules/apps/pages/appsList.connector';
import Home from '../modules/home/pages/home.page';
import LoginRequired from '../modules/auth/components/loginRequired.connector';
import NotFound from '../components/notFound.component';
import Login from '../modules/auth/pages/login.connector';
import ForgotPassword from '../modules/auth/pages/forgotPassword.connector';
import ResetPassword from '../modules/auth/pages/resetPassword.connector';

const routes = [
  { path: '/login', component: Login, exact: true },
  { path: '/forgot-password', component: ForgotPassword, exact: true },
  { path: '/reset-password', component: ResetPassword, exact: true },
  { path: '/', component: () => <Redirect to="/dashboard" />, exact: true },
  {
    component: LoginRequired,
    redirect: true,
    routes: [
      { path: '/dashboard/my-account', exact: true, component: MyAccount },
      { path: '/dashboard/partners/new', exact: true, component: NewPartner },
      { path: '/dashboard/partners/:partnerId', exact: true, component: EditPartner },
      { path: '/dashboard/partners', exact: true, component: PartnersList },
      { path: '/dashboard/apps/new', exact: true, component: NewApp },
      { path: '/dashboard/apps/:appId/hooks/new', exact: true, component: NewHook },
      { path: '/dashboard/apps/:appId/hooks/:hookId', exact: true, component: EditHook },
      { path: '/dashboard/apps/:appId', exact: true, component: EditApp },
      { path: '/dashboard/apps', exact: true, component: AppsList },
      { path: '/dashboard', exact: true, component: Home },
      { component: NotFound },
    ],
  },
];

export default routes;
