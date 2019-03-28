// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import type { ConnectedNewPartnerProps } from './newPartner.connector';

import PartnerForm from '../components/partnerForm.component';
import Meta from '../../../components/meta.component';

const NewPartner = ({ createNewPartner }: ConnectedNewPartnerProps) => (
  <PartnerForm onFormSubmit={data => createNewPartner(data)}>
    {({ children, valid }) => (
      <Card>
        <Meta title="Nouveau partner" />
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Nouveau partner
          </Typography>
          {children}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            type="submit"
            disabled={!valid}
            data-test-id="partnerAddSubmit"
          >
            Créer
          </Button>
        </CardActions>
      </Card>
    )}
  </PartnerForm>
);

export default NewPartner;
