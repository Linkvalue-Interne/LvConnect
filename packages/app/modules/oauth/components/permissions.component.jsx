// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import qs from 'qs';

import type { ContextRouter } from 'react-router';
import type { ConnectedPermissionsProps } from './permissions.connector';

import permissionLabels from '../permissionLabels';
import LoadingPage from '../../../components/loadingPage.component';
import NotFound from '../../../components/notFound.component';

type PermissionsProps = ContextRouter & ConnectedPermissionsProps;

class Permissions extends Component<PermissionsProps> {
  componentDidMount(): void {
    const { location, fetchPermissions } = this.props;
    fetchPermissions(qs.parse(location.search.slice(1)));
  }

  handleAccept = () => {
    const { location, result, postAuthorize } = this.props;
    if (!result || !result.permissionsToAllow) {
      return;
    }
    postAuthorize(qs.parse(location.search.slice(1)), result.permissionsToAllow);
  };

  handleDeny = () => {
    const { location } = this.props;
    const { redirect_uri: redirectUri, state } = qs.parse(location.search.slice(1));
    window.location.replace(`${redirectUri}?${qs.stringify({ state, error: true })}`);
  };

  render() {
    const { error, result, loading } = this.props;

    if (loading) {
      return <LoadingPage />;
    }

    if (error) {
      switch (error.message) {
        case 'application_not_found':
          return (
            <NotFound
              text="L'application n'existe pas."
              subText="Merci de vérifier le paramètre app_id ou client_id dans l'url"
            />
          );
        case 'invalid_redirect_uri':
          return (
            <NotFound
              code={403}
              text="URL de redirection invalide"
              subText="L'url passée à redirect_uri ne correspond à aucune url de l'application"
            />
          );
        case 'invalid_scopes':
          return (
            <NotFound
              code={403}
              text="Scopes invalides"
              subText="Le/les scopes passés en paramètre ne sont pas conformes aux scopes de l'application"
            />
          );
        default:
          return (
            <NotFound
              code={500}
              text="Oops, une erreur inconnue s'est produite"
            />
          );
      }
    }

    if (!result) {
      return null;
    }

    if (result.redirectTo) {
      window.location.replace(result.redirectTo);
      return null;
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {result.application.name}
          </Typography>
          <Typography gutterBottom>
            {`L'application "${result.application.name}"`} souhaite accéder aux permissions suivantes sur
            votre compte LVConnect. Les permissions tiendront cependant compte des droits attribués
            à {'l\'utilisateur'}.
          </Typography>
        </CardContent>
        <List>
          {result.permissionsToAllow.map(permission => (
            <ListItem key={permission}>
              <ListItemIcon>
                {permissionLabels[permission].icon}
              </ListItemIcon>
              <ListItemText
                primary={permissionLabels[permission].label}
                secondary={permissionLabels[permission].description}
              />
            </ListItem>
          ))}
        </List>
        <CardActions>
          <Button
            color="primary"
            autoFocus
            type="submit"
            onClick={this.handleAccept}
          >
            Accepter
          </Button>
          <Button type="button" onClick={this.handleDeny}>Refuser</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withRouter(Permissions);
