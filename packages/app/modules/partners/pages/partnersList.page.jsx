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
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import qs from 'qs';
import config from '@lvconnect/config/app';
import debounce from 'lodash/debounce';

import type { WithStyles } from '@material-ui/core/styles';
import type { ContextRouter } from 'react-router';
import type { ConnectedPartnersListProps } from './partnersList.connector';

import LoadingPage from '../../../components/loadingPage.component';
import Restricted, { hasRole } from '../../../components/restricted.component';
import roleLabels from '../roleLabels';
import jobLabels from '../jobLabels';
import Highlight from '../../../components/highlight.component';

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
  spacer: {
    flex: 1,
  },
  loaderCell: {
    padding: theme.spacing.unit * 4,
  },
});

const roleMap = Object.entries(config.roles)
  .reduce((acc, [key, value]) => ({ ...acc, [typeof value === 'string' ? value : '']: key }), {});

type PartnersListProps = WithStyles & ContextRouter & ConnectedPartnersListProps;
type PartnersListState = {
  search: string;
};

class PartnersList extends Component<PartnersListProps, PartnersListState> {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.debouncedHandleSearchChange = debounce(search => this.props.fetchPartners({
      page: this.getPageNumber(),
      limit: this.props.limit,
      search: search || undefined,
    }), 300);
  }

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

  debouncedHandleSearchChange: (search: string) => void;

  handleChangePage = (event, page) => this.props.push(`/dashboard/partners?page=${page + 1}`);

  handleGoToPartnerWorklog = partnerId => () =>
    hasRole(config.permissions.editUser, this.props.user.roles) && this.props.push(`/dashboard/partners/${partnerId}`);

  handleChangeRowsPerPage = (event) => {
    this.props.changeRowsPerPage(event.target.value);
    this.props.push('/dashboard/partners');
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
    this.debouncedHandleSearchChange(e.target.value);
  };

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
          <div className={classes.spacer} />
          <Input
            id="adornment-password"
            type="text"
            value={this.state.search}
            onChange={this.handleSearchChange}
            placeholder="Rechercher..."
            autoFocus
            startAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className={classes.loaderCell}>
                    <LoadingPage />
                  </TableCell>
                </TableRow>
              ) : partners.map(partner => (
                <TableRow
                  key={partner.id}
                  className={canEditUser ? classes.tableRow : ''}
                  hover={canEditUser}
                  onClick={this.handleGoToPartnerWorklog(partner.id)}
                >
                  <TableCell padding="dense">
                    <Avatar alt={`${partner.firstName} ${partner.lastName}`} src={partner.profilePictureUrl} />
                  </TableCell>
                  <TableCell><Highlight search={this.state.search} text={partner.lastName} /></TableCell>
                  <TableCell><Highlight search={this.state.search} text={partner.firstName} /></TableCell>
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
