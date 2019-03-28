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

import type { ContextRouter } from 'connected-react-router';
import type { ConnectedEditAppProps } from './editApp.connector';
import AppHooks from '../components/appHooks.connector';

import AppForm from '../components/appForm.component';
import Meta from '../../../components/meta.component';

const styles = theme => ({
  topCard: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const selfSelect = e => e.target.select();

type EditAppProps = ContextRouter & ConnectedEditAppProps;
type EditAppState = { deleteModalOpened: boolean; }

class EditApp extends Component<EditAppProps, EditAppState> {
  state = {
    deleteModalOpened: false,
  };

  componentWillMount() {
    const { fetchAppDetails, match } = this.props;
    fetchAppDetails(match.params.appId);
  }

  handleFormSubmit = (data: User) => {
    const { editApp, match } = this.props;
    return editApp(match.params.appId, data);
  };

  handleDeleteApp = async () => {
    const { deleteApp, match, push } = this.props;
    await deleteApp(match.params.appId);
    push('/dashboard/apps');
  };

  handleDeleteModalToggle = value => () => this.setState({ deleteModalOpened: value });

  render() {
    const { app, isLoading, classes } = this.props;
    const { deleteModalOpened } = this.state;
    return !isLoading && app && (
      <Fragment>
        <Meta title={app.name} />
        <Card className={classes.topCard}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {app.name}
            </Typography>
            <TextField
              label="Application ID"
              defaultValue={app.appId}
              InputProps={{
                readOnly: true,
                onFocus: selfSelect,
                inputProps: { 'data-test-id': 'appClientIdInput' },
              }}
              fullWidth
              helperText=" "
            />
            <TextField
              label="Application Secret"
              defaultValue={app.appSecret}
              InputProps={{
                readOnly: true,
                onFocus: selfSelect,
                inputProps: { 'data-test-id': 'appClientSecretInput' },
              }}
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
                <Button
                  size="small"
                  color="primary"
                  type="submit"
                  disabled={!valid || pristine}
                  data-test-id="appEditSubmit"
                >
                  Sauvegarder
                </Button>
                <Button
                  size="small"
                  type="button"
                  onClick={this.handleDeleteModalToggle(true)}
                  data-test-id="appDeleteButton"
                >
                  Supprimer
                </Button>
                <Dialog
                  open={deleteModalOpened}
                  onClose={this.handleDeleteModalToggle(false)}
                  data-test-id="appDeleteDialog"
                >
                  <DialogTitle>Suppression de {app.name}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Vous êtes sur le point de supprimer définitivement une application. Cette action est irréversible
                      et entraîne la suppression de toutes les autorisations, hooks et sessions liés à cette
                      application.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="primary"
                      onClick={this.handleDeleteApp}
                      data-test-id="appDeleteSubmit"
                    >
                      Confirmer la suppression
                    </Button>
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
