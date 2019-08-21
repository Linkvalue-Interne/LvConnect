// @flow

import React, { Component } from 'react';
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
import Meta from '../../../components/meta.component';

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
  disabledPartner: {
    opacity: 0.5,
    filter: 'grayscale(1)',
  },
});

type PartnersListProps = WithStyles & ContextRouter & ConnectedPartnersListProps;
type PartnersListState = {
  search: string;
};

class PartnersList extends Component<PartnersListProps, PartnersListState> {
  debouncedHandleSearchChange: (search: string) => void;

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.debouncedHandleSearchChange = debounce(() => {
      const { replace, fetchPartners, limit } = this.props;
      const { search } = this.state;
      replace('/dashboard/partners');
      return fetchPartners({
        page: 1,
        limit,
        search: search || undefined,
      });
    }, 300);
  }

  componentWillMount() {
    const { fetchPartners, limit } = this.props;
    const { search } = this.state;
    fetchPartners({
      page: this.getPageNumber(),
      limit,
      search: search || undefined,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { fetchPartners, location } = this.props;
    const { search } = this.state;
    if (location.search !== nextProps.location.search) {
      fetchPartners({
        page: this.getPageNumber(nextProps),
        limit: nextProps.limit,
        search: search || undefined,
      });
    }
  }

  getPageNumber = (props = this.props) => Number(qs.parse(props.location.search.slice(1)).page || 1);

  getRowDisplay = () => {
    const { pageCount } = this.props;
    return `${this.getPageNumber()} of ${pageCount}`;
  };

  handleChangePage = (event, page) => {
    const { replace } = this.props;
    return replace(`/dashboard/partners?page=${page + 1}`);
  };

  handleGoToPartnerWorklog = partnerId => () => {
    const { user, push } = this.props;
    return hasRole(config.permissions.editUser, user.roles) && push(`/dashboard/partners/${partnerId}`);
  };

  handleChangeRowsPerPage = (event) => {
    const { replace, changeRowsPerPage } = this.props;
    replace('/dashboard/partners');
    changeRowsPerPage(event.target.value);
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
    this.debouncedHandleSearchChange(e.target.value);
  };

  handleNewPartnerClick = () => {
    const { push } = this.props;
    return push('/dashboard/partners/new');
  };

  render() {
    const {
      partners,
      isLoading,
      classes,
      pageCount,
      limit,
      user,
    } = this.props;
    const { search } = this.state;

    const canEditUser = hasRole(config.permissions.editUser, user.roles);

    return (
      <Paper className={classes.partnersList}>
        <Meta title="Partners" />
        <Toolbar>
          <Typography variant="h5" component="h2" gutterBottom>
            Partners
          </Typography>
          <div className={classes.spacer} />
          <Input
            id="adornment-password"
            type="text"
            value={search}
            onChange={this.handleSearchChange}
            placeholder="Rechercher..."
            autoFocus
            inputProps={{ 'data-test-id': 'partnerListSearch' }}
            startAdornment={(
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )}
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
                  className={
                    `${canEditUser ? classes.tableRow : ''}
                    ${partner.leftAt < new Date().toISOString() || partner.hiredAt > new Date().toISOString()
                      ? classes.disabledPartner
                      : ''
                    }`
                  }
                  hover={canEditUser}
                  onClick={this.handleGoToPartnerWorklog(partner.id)}
                  data-test-id="partnerListRow"
                >
                  <TableCell padding="dense">
                    <Avatar alt={`${partner.firstName} ${partner.lastName}`} src={partner.profilePictureUrl} />
                  </TableCell>
                  <TableCell><Highlight search={search} text={partner.lastName} /></TableCell>
                  <TableCell><Highlight search={search} text={partner.firstName} /></TableCell>
                  <TableCell>{partner.city}</TableCell>
                  <TableCell>{jobLabels[partner.job]}</TableCell>
                  <TableCell className={classes.fullNameCell}>
                    {partner.roles.map(role => roleLabels[role]).join(', ')}
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
            data-test-id="partnerAddButton"
          >
            <AddIcon />
          </Fab>
        </Restricted>
      </Paper>
    );
  }
}

export default withStyles(styles)(PartnersList);
