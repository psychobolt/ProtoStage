import React from 'react';
import { connect } from 'react-redux';
import { SegmentPathTool } from '@psychobolt/react-paperjs';

import { getCanvas } from 'App/App.selectors';

import { addPath, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';
import styles from './SegmentTool.style';

export default Container =>
  @connect(
    state => {
      const { selectedPathIds, activeLayer } = getCanvas(state);
      return { selectedPathIds, activeLayer };
    },
    dispatch => ({
      newPath: (path, skipHistory) => dispatch(addPath(path, skipHistory)),
      deselectAll: () => dispatch(deselectAll()),
    }),
  )
  class extends Tool {
    getIcon = () => <x-icon style={styles.icon} name="timeline" />

    getTool = ref => <SegmentPathTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

    onSelect() {
      super.onSelect();
      if (this.props.selectedPathIds.length) this.props.deselectAll();
    }

    onPathAdd = path => {
      path.remove();
      this.props.newPath({
        type: 'Path',
        pathData: path.pathData,
        strokeColor: 'black',
        layer: this.props.activeLayer,
      });
    }

    TOOL_NAME = 'Segment'
    Container = Container
  };
