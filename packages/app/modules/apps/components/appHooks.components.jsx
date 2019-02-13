// @flow

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/CheckCircle';
import config from '@lvconnect/config/app';

import LoadingPage from '../../../components/loadingPage.component';
import type { ConnectedAppHooksProps } from './appHooks.connector';

const styles = theme => ({
  hookList: {
    marginTop: theme.spacing.unit * 3,
  },
});

type AppHooksProps = ConnectedAppHooksProps & {
  classes: any;
  appId: string;
  hooks: Array<Hook>;
  loading: boolean;
}

class AppHooks extends Component<AppHooksProps> {
  componentDidMount() {
    const { fetchHooks, appId } = this.props;
    fetchHooks(appId);
  }

  render() {
    const { classes, appId, hooks, loading, push, isLoading } = this.props;

    if (isLoading) {
      return <LoadingPage />;
    }

    return (
      <Card className={classes.hookList}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Hooks
          </Typography>
          <Typography gutterBottom>
            Les hooks sont des adresses HTTP qui peuvent écouter les évènements de LVConnect. Ces adresses seront
            appelées lorsque les évènements correspondants surviendront par méthode POST. Pour plus d{'\''}
            information, merci de se reporter à la
            &nbsp;
            <a
              href="https://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/blob/master/docs/hooks.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation de LVConnect
            </a>.
          </Typography>
        </CardContent>
        {!loading && (
          <List dense>
            {hooks.map(hook => (
              <ListItem key={hook.id} button onClick={() => push(`/dashboard/apps/${appId}/hooks/${hook.id}`)}>
                <ListItemIcon>
                  <Icon
                    color={hook.runs && hook.runs[0].status === config.hooks.statuses.failure ? 'error' : 'primary'}
                  >
                    {(hook.runs && hook.runs.length > 0 && hook.runs[0].status === config.hooks.statuses.failure)
                      ? <ErrorIcon />
                      : <CheckIcon />}
                  </Icon>
                </ListItemIcon>
                <ListItemText primary={hook.name} secondary={hook.uri} />
              </ListItem>
            ))}
            <ListItem button onClick={() => push(`/dashboard/apps/${appId}/hooks/new`)}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Ajouter un nouveau" />
            </ListItem>
          </List>
        )}
      </Card>
    );
  }
}

export default withStyles(styles)(AppHooks);
