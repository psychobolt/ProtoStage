import React from 'react';
import { connect } from 'react-redux';
import { SegmentPathTool } from '@psychobolt/react-paperjs';

import { addPath, deselectAll } from '../../Canvas.actions';
import { getCanvas } from '../../Canvas.selectors';
import { Tool } from '../shared/Tool';
import styles from './SegmentTool.style';

export default Container =>
  @connect(
    state => ({ selectedPathIds: getCanvas(state.editor).selectedPathIds }),
    dispatch => ({
      newPath: path => dispatch(addPath(path)),
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
      });
    }

    TOOL_NAME = 'Segment'
    Container = Container
  };