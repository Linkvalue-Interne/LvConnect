// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import type { ContextRouter } from 'react-router';
import type { ConnectedNewHookDispatchProps } from './newHook.connector';

import HookForm from '../components/hookForm.component';
import Meta from '../../../components/meta.component';

type NewHookProps = ConnectedNewHookDispatchProps & ContextRouter & {
};

const NewHook = ({ createNewHook, match: { params: { appId } } }: NewHookProps) => (
  <HookForm appId={appId} onFormSubmit={createNewHook}>
    {({ children, valid }) => (
      <Card>
        <Meta title="Nouveau hook" />
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Nouveau hook
          </Typography>
          {children}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            type="submit"
            disabled={!valid}
            data-test-id="hookAddSubmit"
          >
            Créer
          </Button>
        </CardActions>
      </Card>
    )}
  </HookForm>
);

export default NewHook;
