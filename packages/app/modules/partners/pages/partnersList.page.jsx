// @flow

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import qs from 'qs';
import config from '@lvconnect/config/app';

import type { WithStyles } from '@material-ui/core/styles';
import type { ContextRouter } from 'react-router';
import type { ConnectedPartnersListProps } from './partnersList.connector';

import LoadingPage from '../../../components/loadingPage.component';
import Restricted, { hasRole } from '../../../components/restricted.component';
import roleLabels from '../roleLabels';
import jobLabels from '../jobLabels';

const styles = theme => ({
  partnersList: {
    marginBottom: theme.spacing.unit * 10,
  },
  fullNameCell: {
    width: '70%',
    whiteSpace: 'nowrap',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  partnersTable: {
    overflowY: 'visible',
  },
  tableFooter: {
    width: '100%',
  },
  tableRow: {
    cursor: 'pointer',
  },
  addPartnerButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

const roleMap = Object.entries(config.roles)
  .reduce((acc, [key, value]) => ({ ...acc, [typeof value === 'string' ? value : '']: key }), {});

type PartnersListProps = WithStyles & ContextRouter & ConnectedPartnersListProps;

class PartnersList extends Component<PartnersListProps> {
  componentWillMount() {
    this.props.fetchPartners({
      page: this.getPageNumber(),
      limit: this.props.limit,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.props.fetchPartners({
        page: this.getPageNumber(nextProps),
        limit: nextProps.limit,
      });
    }
  }

  getPageNumber = (props = this.props) => Number(qs.parse(props.location.search.slice(1)).page || 1);

  getRowDisplay = () => `${this.getPageNumber()} of ${this.props.pageCount}`;

  handleChangePage = (event, page) => this.props.push(`/dashboard/partners?page=${page + 1}`);

  handleGoToPartnerWorklog = partnerId => () =>
    hasRole(config.permissions.editUser, this.props.user.roles) && this.props.push(`/dashboard/partners/${partnerId}`);

  handleChangeRowsPerPage = event => this.props.fetchPartners({
    page: this.getPageNumber(),
    limit: event.target.value,
  });

  handleNewPartnerClick = () => this.props.push('/dashboard/partners/new');

  render() {
    const {
      partners,
      isLoading,
      classes,
      pageCount,
      limit,
      user,
    } = this.props;

    if (isLoading) {
      return <LoadingPage />;
    }

    const canEditUser = hasRole(config.permissions.editUser, user.roles);

    return (
      <Paper className={classes.partnersList}>
        <Helmet>
          <title>Partners | LVConnect</title>
        </Helmet>
        <Toolbar>
          <Typography variant="h5" component="h2" gutterBottom>
            Partners
          </Typography>
        </Toolbar>
        <div className={classes.tableWrapper}>
          <Table className={classes.partnersTable}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Ville</TableCell>
                <TableCell>Compétence principale</TableCell>
                <TableCell>Rôles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.map(partner => (
                <TableRow
                  key={partner.id}
                  className={canEditUser ? classes.tableRow : ''}
                  hover={canEditUser}
                  onClick={this.handleGoToPartnerWorklog(partner.id)}
                >
                  <TableCell padding="dense">
                    <Avatar alt={`${partner.firstName} ${partner.lastName}`} src={partner.profilePictureUrl} />
                  </TableCell>
                  <TableCell>{partner.lastName}</TableCell>
                  <TableCell>{partner.firstName}</TableCell>
                  <TableCell>{partner.city}</TableCell>
                  <TableCell>{jobLabels[partner.job]}</TableCell>
                  <TableCell className={classes.fullNameCell}>
                    {partner.roles.map(role => roleLabels[roleMap[role]]).join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <table className={classes.tableFooter}>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={pageCount * limit}
                rowsPerPage={limit}
                labelDisplayedRows={this.getRowDisplay}
                page={this.getPageNumber() - 1}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </TableRow>
          </TableFooter>
        </table>
        <Restricted roles={config.permissions.addUser}>
          <Fab
            classes={{ root: classes.addPartnerButton }}
            color="primary"
            aria-label="Add"
            onClick={this.handleNewPartnerClick}
          >
            <AddIcon />
          </Fab>
        </Restricted>
      </Paper>
    );
  }
}

export default withStyles(styles)(PartnersList);
