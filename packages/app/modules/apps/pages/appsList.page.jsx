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
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import qs from 'qs';
import config from '@lvconnect/config/app';

import type { WithStyles } from '@material-ui/core/styles';
import type { ContextRouter } from 'react-router';
import type { ConnectedAppsListProps } from './appsList.connector';

import LoadingPage from '../../../components/loadingPage.component';
import Restricted, { hasRole } from '../../../components/restricted.component';

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
});

type AppsListProps = WithStyles & ContextRouter & ConnectedAppsListProps;

class AppsList extends Component<AppsListProps> {
  componentWillMount() {
    this.props.fetchApps({
      page: this.getPageNumber(),
      limit: this.props.limit,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.props.fetchApps({
        page: this.getPageNumber(nextProps),
        limit: nextProps.limit,
      });
    }
  }

  getPageNumber = (props = this.props) => Number(qs.parse(props.location.search.slice(1)).page || 1);

  getRowDisplay = () => `${this.getPageNumber()} of ${this.props.pageCount}`;

  handleChangePage = (event, page) => this.props.push(`/dashboard/apps?page=${page + 1}`);

  handleGoToApp = appId => () => this.props.push(`/dashboard/apps/${appId}`);

  handleChangeRowsPerPage = event => this.props.fetchApps({
    page: this.getPageNumber(),
    limit: event.target.value,
  });

  handleNewAppClick = () => this.props.push('/dashboard/apps/new');

  render() {
    const {
      apps,
      isLoading,
      classes,
      pageCount,
      limit,
      user,
    } = this.props;

    if (isLoading) {
      return <LoadingPage />;
    }

    const canEditApp = hasRole(config.permissions.editApp, user.roles);

    return (
      <Paper className={classes.appsList}>
        <Helmet>
          <title>Apps | LVConnect</title>
        </Helmet>
        <Toolbar>
          <Typography variant="h5" component="h2" gutterBottom>
            Apps
          </Typography>
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
              {apps.map(app => (
                <TableRow
                  key={app.id}
                  className={canEditApp ? classes.tableRow : ''}
                  hover={canEditApp}
                  onClick={canEditApp ? this.handleGoToApp(app.id) : undefined}
                >
                  <TableCell>{app.name}</TableCell>
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
          >
            <AddIcon />
          </Fab>
        </Restricted>
      </Paper>
    );
  }
}

export default withStyles(styles)(AppsList);
