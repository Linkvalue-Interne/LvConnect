// @flow

import React, { Fragment } from 'react';

const { Consumer, Provider: RolesProvider } = React.createContext([]);

const hasRole = (roles: Array<string>, userRoles: Array<string>) =>
  roles.some(role => userRoles.includes(role));

type RestrictedProps = {
  roles: Array<string>,
  children: any,
}

const Restricted = ({ roles, children }: RestrictedProps) => (
  <Consumer>
    {userRoles => hasRole(roles, userRoles) && (
      <Fragment>
        {children}
      </Fragment>
    )}
  </Consumer>
);

export {
  RolesProvider,
  hasRole,
};

export default Restricted;
