// @flow

import React, { Component, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

import type { ContextRouter } from 'react-router-redux';
import type { ConnectedEditAppProps } from './editApp.connector';
import AppHooks from '../components/appHooks.connector';

import AppForm from '../components/appForm.component';

const styles = theme => ({
  topCard: {
    marginBottom: theme.spacing.unit * 2,
  },
});

type EditAppProps = ContextRouter & ConnectedEditAppProps;
type EditAppState = { deleteModalOpened: boolean; }

class EditApp extends Component<EditAppProps, EditAppState> {
  state = {
    deleteModalOpened: false,
  };

  componentWillMount() {
    this.props.fetchAppDetails(this.props.match.params.appId);
  }

  handleFormSubmit = (data: User) => this.props.editApp(this.props.match.params.appId, data);

  handleDeleteApp = async () => {
    await this.props.deleteApp(this.props.match.params.appId);
    this.props.push('/dashboard/apps');
  };

  handleDeleteModalToggle = value => () => this.setState({ deleteModalOpened: value });

  render() {
    const { app, isLoading, classes } = this.props;
    const { deleteModalOpened } = this.state;
    return !isLoading && app && (
      <Fragment>
        <Helmet>
          <title>{app.name} | LVConnect</title>
        </Helmet>
        <Card className={classes.topCard}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {app.name}
            </Typography>
            <TextField
              label="Application ID"
              defaultValue={app.appId}
              InputProps={{ readOnly: true, onFocus: e => e.target.select() }}
              fullWidth
              helperText=" "
            />
            <TextField
              label="Application Secret"
              defaultValue={app.appSecret}
              InputProps={{ readOnly: true, onFocus: e => e.target.select() }}
              fullWidth
              helperText=" "
            />
          </CardContent>
          <CardActions>
            <Button
              target="_blank"
              rel="noopener noreferrer"
              href={`/oauth/authorize?client_id=${app.appId}&redirect_uri=${encodeURI(app.redirectUris[0])}`}
            >
              {'Test d\'autorisation'}
            </Button>
          </CardActions>
        </Card>
        <AppForm
          appId={app.id}
          initialValues={{ ...app, redirectUris: app.redirectUris.join('\n') }}
          onFormSubmit={this.handleFormSubmit}
        >
          {({ children, valid, pristine }) => (
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Editer {app.name}
                </Typography>
                {children}
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" type="submit" disabled={!valid || pristine}>Sauvegarder</Button>
                <Button size="small" type="button" onClick={this.handleDeleteModalToggle(true)}>Supprimer</Button>
                <Dialog open={deleteModalOpened} onClose={this.handleDeleteModalToggle(false)}>
                  <DialogTitle>Suppression de {app.name}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Vous êtes sur le point de supprimer définitivement une application. Cette action est irréversible
                      et entraîne la suppression de toutes les autorisations, hooks et sessions liés à cette
                      application.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={this.handleDeleteApp}>Confirmer la suppression</Button>
                    <Button autoFocus onClick={this.handleDeleteModalToggle(false)}>Annuler</Button>
                  </DialogActions>
                </Dialog>
              </CardActions>
            </Card>
          )}
        </AppForm>
        <AppHooks appId={app.id} />
      </Fragment>
    );
  }
}

export default withStyles(styles)(EditApp);
