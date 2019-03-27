// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import type { ConnectedNewAppProps } from './newApp.connector';

import AppForm from '../components/appForm.component';
import Meta from '../../../components/meta.component';

const NewApp = ({ createNewApp }: ConnectedNewAppProps) => (
  <AppForm onFormSubmit={data => createNewApp(data)}>
    {({ children, valid }) => (
      <Card>
        <Meta title="Nouvelle application" />
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Nouvelle application
          </Typography>
          {children}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            type="submit"
            disabled={!valid}
            data-test-id="appAddSubmit"
          >
            Créer
          </Button>
        </CardActions>
      </Card>
    )}
  </AppForm>
);

export default NewApp;
