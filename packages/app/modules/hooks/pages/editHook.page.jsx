// @flow

import React, { Component, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import type { ContextRouter } from 'react-router';
import type { ConnectedEditHookProps } from './editHook.connector';

import HookForm from '../components/hookForm.component';
import RunsList from '../components/runsList.component';
import Meta from '../../../components/meta.component';

type EditHookProps = ConnectedEditHookProps & ContextRouter & {
  classes: any;
};

type EditHookState = {
  expanded: string | boolean;
  tab: number;
};

class EditHook extends Component<EditHookProps, EditHookState> {
  componentDidMount() {
    const { fetchHookDetails, match: { params: { hookId } } } = this.props;
    if (hookId) {
      fetchHookDetails(hookId);
    }
  }

  handleDeleteHook = async () => {
    const { push, deleteHook, match: { params: { hookId, appId } } } = this.props;
    if (hookId) {
      await deleteHook(hookId);
      push(`/dashboard/apps/${appId || ''}`);
    }
  };

  render() {
    const { isLoading, hook, editHook, match: { params: { appId } } } = this.props;
    return !isLoading && hook && (
      <Fragment>
        <HookForm appId={appId} onFormSubmit={editHook} initialValues={hook}>
          {({ children, valid, pristine }) => (
            <Card>
              <Meta title={`${hook.name} | Hooks`} />
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {hook.name}
                </Typography>
                {children}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  type="submit"
                  disabled={!valid || pristine}
                  data-test-id="hookEditSubmit"
                >
                  Sauvegarder
                </Button>
                <Button
                  size="small"
                  type="button"
                  onClick={this.handleDeleteHook}
                  data-test-id="hookDeleteButton"
                >
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          )}
        </HookForm>
        {hook.runs && <RunsList runs={hook.runs} />}
      </Fragment>
    );
  }
}

export default EditHook;
