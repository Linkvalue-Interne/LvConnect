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
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import debounce from 'lodash/debounce';
import qs from 'qs';
import config from '@lvconnect/config/app';

import type { WithStyles } from '@material-ui/core/styles';
import type { ContextRouter } from 'react-router';
import type { ConnectedAppsListProps } from './appsList.connector';

import LoadingPage from '../../../components/loadingPage.component';
import Restricted, { hasRole } from '../../../components/restricted.component';
import Highlight from '../../../components/highlight.component';
import Meta from '../../../components/meta.component';

const styles = theme => ({
  appsList: {
    marginBottom: theme.spacing.unit * 10,
  },
  fullNameCell: {
    width: '70%',
    whiteSpace: 'nowrap',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  appsTable: {
    overflowY: 'visible',
  },
  tableFooter: {
    width: '100%',
  },
  tableRow: {
    cursor: 'pointer',
  },
  addAppButton: {
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

type AppsListProps = WithStyles & ContextRouter & ConnectedAppsListProps;
type AppsListState = { search: string };

class AppsList extends Component<AppsListProps, AppsListState> {
  debouncedHandleSearchChange: (search: string) => void;

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.debouncedHandleSearchChange = debounce(() => {
      const { replace, fetchPartners, limit } = this.props;
      const { search } = this.state;
      replace('/dashboard/apps');
      return fetchPartners({
        page: 1,
        limit,
        search: search || undefined,
      });
    }, 300);
  }

  componentWillMount() {
    const { fetchApps, limit } = this.props;
    fetchApps({
      page: this.getPageNumber(),
      limit,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    if (location.search !== nextProps.location.search) {
      nextProps.fetchApps({
        page: this.getPageNumber(nextProps),
        limit: nextProps.limit,
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
    return replace(`/dashboard/apps?page=${page + 1}`);
  };

  handleGoToApp = appId => () => {
    const { push } = this.props;
    return push(`/dashboard/apps/${appId}`);
  };

  handleChangeRowsPerPage = (event) => {
    const { fetchApps } = this.props;
    return fetchApps({
      page: this.getPageNumber(),
      limit: event.target.value,
    });
  };

  handleNewAppClick = () => {
    const { push } = this.props;
    return push('/dashboard/apps/new');
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
    this.debouncedHandleSearchChange(e.target.value);
  };

  render() {
    const {
      apps,
      isLoading,
      classes,
      pageCount,
      limit,
      user,
    } = this.props;
    const { search } = this.state;
    const canEditApp = hasRole(config.permissions.editApp, user.roles);

    return (
      <Paper className={classes.appsList}>
        <Meta title="Applications" />
        <Toolbar>
          <Typography variant="h5" component="h2" gutterBottom>
            Apps
          </Typography>
          <div className={classes.spacer} />
          <Input
            id="adornment-password"
            type="text"
            value={search}
            onChange={this.handleSearchChange}
            placeholder="Rechercher..."
            autoFocus
            startAdornment={(
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )}
          />
        </Toolbar>
        <div className={classes.tableWrapper}>
          <Table className={classes.appsTable}>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Auteur</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className={classes.loaderCell}>
                    <LoadingPage />
                  </TableCell>
                </TableRow>
              ) : apps.map(app => (
                <TableRow
                  key={app.id}
                  className={canEditApp ? classes.tableRow : ''}
                  hover={canEditApp}
                  onClick={canEditApp ? this.handleGoToApp(app.id) : undefined}
                  data-test-id="applicationListRow"
                >
                  <TableCell><Highlight search={search} text={app.name} /></TableCell>
                  <TableCell>{app.description}</TableCell>
                  <TableCell>{app.user && `${app.user.lastName} ${app.user.firstName}`}</TableCell>
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
        <Restricted roles={config.permissions.addApp}>
          <Fab
            classes={{ root: classes.addAppButton }}
            color="primary"
            aria-label="Add"
            onClick={this.handleNewAppClick}
            data-test-id="applicationAddButton"
          >
            <AddIcon />
          </Fab>
        </Restricted>
      </Paper>
    );
  }
}

export default withStyles(styles)(AppsList);
