// @flow

import React, { Component, Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import config from '@lvconnect/config';
import moment from 'moment';

const styles = theme => ({
  runsList: {
    marginTop: theme.spacing.unit * 3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flex: 1,
    marginLeft: theme.spacing.unit,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  panelBody: {
    flexDirection: 'column',
  },
  codeBlock: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing.unit / 2,
    border: `solid 1px ${theme.palette.divider}`,
    overflowX: 'auto',
  },
  jsonBlock: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 1.2,
    whiteSpace: 'pre',
    color: theme.palette.primary.dark,
  },
  responseBadge: {
    position: 'relative',
    top: -1,
    fontSize: 10,
    padding: `0 ${theme.spacing.unit / 2}px`,
    marginLeft: theme.spacing.unit,
    borderRadius: 3,
  },
  responseBadgeError: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
  },
  responseBadgeSuccess: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
});

type RunsListProps = {
  runs: Array<HookRun>;
  classes: any;
};

type RunsListState = {
  expanded: string | boolean;
  tab: number;
};

class RunsList extends Component<RunsListProps, RunsListState> {
  state = {
    expanded: false,
    tab: 0,
  };

  static getParsedBody = (body) => {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch (e) {
      return body;
    }
  };

  handleChange = panel => (event, expanded) => this.setState({
    tab: 0,
    expanded: expanded ? panel : false,
  });

  handleTabChange = (event, tab) => this.setState({
    tab,
  });

  render() {
    const { runs, classes } = this.props;
    const { tab, expanded } = this.state;
    return (
      <Fragment>
        <Card className={classes.runsList}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Derniers lancements
            </Typography>
          </CardContent>
        </Card>
        {runs.map((run, i) => (
          <ExpansionPanel
            key={run.identifier}
            expanded={expanded === `panel${i}`}
            onChange={this.handleChange(`panel${i}`)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Icon color={run.status === config.hooks.statuses.failure ? 'error' : 'primary'}>
                {run.status === config.hooks.statuses.failure ? <ErrorIcon /> : <CheckIcon />}
              </Icon>
              <Typography className={classes.heading}>{run.identifier}</Typography>
              <Typography className={classes.secondaryHeading}>{moment(run.dateEnd).format('LLL')}</Typography>
            </ExpansionPanelSummary>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleTabChange}
            >
              <Tab label="Request" />
              <Tab
                label={
                  run.response
                    ? (
                      <Fragment>
                        Réponse
                        <span
                          className={`
                            ${classes.responseBadge}
                            ${run.status === config.hooks.statuses.failure
                              ? classes.responseBadgeError
                              : classes.responseBadgeSuccess
                            }`}
                        >
                          {run.response.statusCode}
                        </span>
                      </Fragment>
                    )
                    : 'Réponse'
                }
              />
            </Tabs>
            <Divider />
            {tab === 0 && (
              <ExpansionPanelDetails className={classes.panelBody}>
                <Typography variant="subtitle1">Headers</Typography>
                <div className={classes.codeBlock}>
                  {Object.entries(JSON.parse(run.request.headers)).map(([key, value]) => (
                    <Typography key={key}>
                      <b>{key}</b>: {value}
                    </Typography>
                  ))}
                </div>
                <Typography variant="subtitle1">Payload</Typography>
                <div className={`${classes.codeBlock} ${classes.jsonBlock}`}>
                  {JSON.stringify(JSON.parse(run.request.body), null, 2)}
                </div>
              </ExpansionPanelDetails>
            )}
            {tab === 1 && (
              <ExpansionPanelDetails className={classes.panelBody}>
                {run.response !== undefined ? (
                  <Fragment>
                    <Typography variant="subtitle1">Headers</Typography>
                    <div className={classes.codeBlock}>
                      {Object.entries(JSON.parse(run.response.headers)).map(([key, value]) => (
                        <Typography key={key}>
                          <b>{key}</b>: {value}
                        </Typography>
                      ))}
                    </div>
                    <Typography variant="subtitle1">Payload</Typography>
                    <div className={`${classes.codeBlock} ${classes.jsonBlock}`}>
                      {RunsList.getParsedBody(run.response.body)}
                    </div>
                  </Fragment>
                ) : (
                  <Typography>
                    La requête n{'\''}a pas aboutie.
                    L{'\''}hôte n{'\''}a pas pû être contacté ou une erreur est survenue.
                  </Typography>
                )}
              </ExpansionPanelDetails>
            )}
          </ExpansionPanel>
        ))}
      </Fragment>
    );
  }
}

export default withStyles(styles)(RunsList);
