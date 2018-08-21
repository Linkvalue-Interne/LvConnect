// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Helmet } from 'react-helmet';

import type { ConnectedNewPartnerProps } from './newPartner.connector';

import PartnerForm from '../components/partnerForm.component';

const NewPartner = ({ createNewPartner }: ConnectedNewPartnerProps) => (
  <PartnerForm onFormSubmit={data => createNewPartner(data)}>
    {({ children, valid }) => (
      <Card>
        <Helmet>
          <title>Nouveau partner | LVConnect</title>
        </Helmet>
        <CardContent>
          <Typography variant="headline" component="h2" gutterBottom>
            Nouveau partner
          </Typography>
          {children}
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" type="submit" disabled={!valid}>Créer</Button>
        </CardActions>
      </Card>
    )}
  </PartnerForm>
);

export default NewPartner;
