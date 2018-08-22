// @flow

import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Helmet } from 'react-helmet';

import type { ContextRouter } from 'react-router-redux';
import type { ConnectedEditPartnerProps } from './editPartner.connector';

import PartnerForm from '../components/partnerForm.component';

type EditPartnerProps = ContextRouter & ConnectedEditPartnerProps;

class EditPartner extends Component<EditPartnerProps> {
  componentWillMount() {
    this.props.fetchPartnerDetails(this.props.match.params.partnerId);
  }

  handleFormSubmit = (data: User) => this.props.editPartner(this.props.match.params.partnerId, data);

  handleDeletePartner = async () => {
    await this.props.deletePartner(this.props.match.params.partnerId);
    this.props.push('/dashboard/partners');
  };

  render() {
    const { partner, isLoading } = this.props;
    return !isLoading && partner && (
      <PartnerForm editMode initialValues={partner} onFormSubmit={this.handleFormSubmit}>
        {({ children, valid, pristine }) => (
          <Card>
            <Helmet>
              <title>{partner.firstName} {partner.lastName} | LVConnect</title>
            </Helmet>
            <CardContent>
              <Typography variant="headline" component="h2" gutterBottom>
                {partner.firstName} {partner.lastName}
              </Typography>
              {children}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" type="submit" disabled={!valid || pristine}>Sauvegarder</Button>
              <Button size="small" type="button" onClick={this.handleDeletePartner}>Supprimer</Button>
            </CardActions>
          </Card>
        )}
      </PartnerForm>
    );
  }
}

export default EditPartner;
