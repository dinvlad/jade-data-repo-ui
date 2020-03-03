import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
  Button,
  Chip,
} from '@material-ui/core';
import { CameraAlt, Edit, PeopleAlt, OpenInNew, Today } from '@material-ui/icons';
import clsx from 'clsx';
import { openSnapshotDialog } from '../../actions';
import moment from 'moment';

const styles = theme => ({
  snapshotName: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px 4px 0px 0px',
  },
  content: {
    padding: theme.spacing(2),
  },
  withIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  inline: {
    marginRight: theme.spacing(1),
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    textAlign: 'end',
  },
  listItem: {
    listStyleType: 'none',
    marginBottom: theme.spacing(1),
  },
  bodyText: {
    paddingBottom: theme.spacing(2),
  },
  light: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  chip: {
    backgroundColor: theme.palette.primary.light,
    margin: theme.spacing(0.5),
    marginLeft: '0px',
  },
});

export class SnapshotPopup extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    variants: PropTypes.number,
    snapshot: PropTypes.object,
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch(openSnapshotDialog(false));
  };

  render() {
    const { classes, dataset, filterData, isOpen, variants, snapshot } = this.props;

    const variantLabel = variants == 1 ? 'Variant' : 'Variants';

    const tables = _.keys(filterData).map((table, i) => {
      const filters = _.get(filterData, table);
      const properties = _.keys(filters).map((filter, i) => {
        const data = _.get(filters, filter);
        let dataString = data.value;
        let dataDisplay;
        if (data.type === 'range') {
          const enDash = ' \u2013 ';
          dataString = _.join(data.value, enDash);
          const label = `${filter}: ${dataString}`;
          dataDisplay = <Chip key={i} className={classes.chip} label={label} />;
        } else {
          if (_.isPlainObject(data.value)) {
            dataString = _.keys(data.value);
          }
          dataDisplay = dataString.map((selection, i) => {
            const label = `${filter}: ${selection}`;
            return <Chip key={i} className={classes.chip} label={label} />;
          });
        }
        return dataDisplay;
      });

      return (
        <div className={classes.bodyText} key={i}>
          <div className={classes.light}>{table}</div>
          <div>{properties}</div>
        </div>
      );
    });

    return (
      <Dialog open={isOpen} onClose={this.handleClose}>
        <DialogTitle>
          <Typography variant="h5">Your data snapshot has been created</Typography>
        </DialogTitle>
        <DialogContent>
          <Paper variant="outlined">
            <div className={clsx(classes.snapshotName, classes.content, classes.withIcon)}>
              <CameraAlt className={classes.inline} />
              <Typography variant="h6">{snapshot.name}</Typography>
            </div>
            <div className={classes.content}>
              <div className={classes.bodyText}>
                <Typography variant="h6">
                  {variants} {variantLabel}
                </Typography>
              </div>
              <Typography variant="subtitle1" color="primary">
                Properties
              </Typography>
              <div>{tables}</div>
              <Typography variant="subtitle1" color="primary">
                Sources
              </Typography>
              <div className={classes.bodyText}>
                <li className={classes.listItem}>{dataset.name}</li>
              </div>
              <div className={clsx(classes.light, classes.withIcon)}>
                <Today className={classes.inline} />
                {moment().format('ll')}
              </div>
            </div>
          </Paper>
          <div className={classes.actions}>
            <Button className={classes.inline} color="primary">
              <Edit className={classes.inline} />
              Edit
            </Button>
            <Button className={classes.inline} color="primary">
              <PeopleAlt className={classes.inline} />
              Share
            </Button>
            <Button color="primary">
              <OpenInNew className={classes.inline} />
              Export
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.snapshots.dialogIsOpen,
    dataset: state.datasets.dataset,
    filterData: state.query.filterData,
    variants: state.query.queryResults.totalRows,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotPopup));