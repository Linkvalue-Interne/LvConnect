// @flow

import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { Helmet } from 'react-helmet';

import type { ContextRouter } from 'react-router-redux';
import type { ConnectedEditPartnerProps } from './editPartner.connector';

import PartnerForm from '../components/partnerForm.component';

type EditPartnerProps = ContextRouter & ConnectedEditPartnerProps & {
  partnerId?: String,
  title?: String,
  cardTitle?: String,
};

type EditPartnerState = {
  open: boolean,
}

class EditPartner extends Component<EditPartnerProps, EditPartnerState> {
  constructor(props: EditPartnerProps) {
    super(props);

    this.state = {
      open: false,
    };
  }

  componentWillMount() {
    const { partnerId, match } = this.props;
    this.props.fetchPartnerDetails(partnerId || match.params.partnerId);
  }

  componentDidUpdate(prevProps: EditPartnerProps) {
    const { match, fetchPartnerDetails } = this.props;
    if (match.params.partnerId !== prevProps.match.params.partnerId) {
      fetchPartnerDetails(match.params.partnerId);
    }
  }

  handleFormSubmit = (data: User) => {
    const { partnerId, match } = this.props;
    return this.props.editPartner(partnerId || match.params.partnerId, data);
  };

  handleDeletePartner = async () => {
    await this.props.deletePartner(this.props.match.params.partnerId);
    this.props.push('/dashboard/partners');
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    const { title, cardTitle, partner, isLoading } = this.props;
    return !isLoading && partner && (
      <PartnerForm editMode initialValues={partner} onFormSubmit={this.handleFormSubmit}>
        {({ children, valid, pristine }) => (
          <Card>
            <Helmet>
              <title>{title || `${partner.firstName} ${partner.lastName}`} | LVConnect</title>
            </Helmet>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {cardTitle || `${partner.firstName} ${partner.lastName}`}
              </Typography>
              {children}
            </CardContent>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirmer la suppresion</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  La suppression {'d\'un'} partner est irréverssible et ne permet plus {'d\'utiliser'} ses données sur
                  les application auquelles il était connecté. Si vous souhaitez désactiver ce compte, renseignez une
                  date de sortie pour désactiver le compte.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  Renseigner une date de sortie
                </Button>
                <Button onClick={this.handleDeletePartner}>
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>
            <CardActions>
              <Button size="small" color="primary" type="submit" disabled={!valid || pristine}>Sauvegarder</Button>
              <Button size="small" type="button" onClick={this.handleOpen}>Supprimer</Button>
            </CardActions>
          </Card>
        )}
      </PartnerForm>
    );
  }
}

export default EditPartner;
