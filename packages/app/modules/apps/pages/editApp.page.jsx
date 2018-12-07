// @flow

import React, { Component, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

import type { ContextRouter } from 'react-router-redux';
import type { ConnectedEditAppProps } from './editApp.connector';

import AppForm from '../components/appForm.component';

const styles = theme => ({
  topCard: {
    marginBottom: theme.spacing.unit * 2,
  },
});

type EditAppProps = ContextRouter & ConnectedEditAppProps;

class EditApp extends Component<EditAppProps> {
  componentWillMount() {
    this.props.fetchAppDetails(this.props.match.params.appId);
  }

  handleFormSubmit = (data: User) => this.props.editApp(this.props.match.params.appId, data);

  handleDeleteApp = async () => {
    await this.props.deleteApp(this.props.match.params.appId);
    this.props.push('/dashboard/apps');
  };

  render() {
    const { app, isLoading, classes } = this.props;
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
              InputProps={{ readOnly: true }}
              fullWidth
              helperText=" "
            />
            <TextField
              label="Application Secret"
              defaultValue={app.appSecret}
              InputProps={{ readOnly: true }}
              fullWidth
              helperText=" "
            />
          </CardContent>
        </Card>
        <AppForm initialValues={app} onFormSubmit={this.handleFormSubmit}>
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
                <Button size="small" type="button" onClick={this.handleDeleteApp}>Supprimer</Button>
              </CardActions>
            </Card>
          )}
        </AppForm>
      </Fragment>
    );
  }
}

export default withStyles(styles)(EditApp);
