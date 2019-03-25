// @flow

import React, { Fragment } from 'react';

const { Consumer: RolesConsumer, Provider: RolesProvider } = React.createContext<string[]>([]);

const hasRole = (roles: string[], userRoles: string[]) => roles.some(role => userRoles.includes(role));

type RestrictedProps = {
  roles: Array<string>,
  children: any,
}

const Restricted = ({ roles, children }: RestrictedProps) => (
  <RolesConsumer>
    {userRoles => hasRole(roles, userRoles) && (
      <Fragment>
        {children}
      </Fragment>
    )}
  </RolesConsumer>
);

export {
  RolesConsumer,
  RolesProvider,
  hasRole,
};

export default Restricted;
