import React from 'react';
import { connect } from 'react-redux';
import { LineTool } from '@psychobolt/react-paperjs';

import { addPath, deselectAll } from '../../Canvas.actions';
import { getCanvas } from '../../Canvas.selectors';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(
    state => {
      const { selectedPathIds } = getCanvas(state.editor);
      return { selectedPathIds };
    },
    dispatch => ({
      newPath: path => dispatch(addPath(path)),
      deselectAll: () => dispatch(deselectAll()),
    }),
  )
  class extends Tool {
    getIcon = () => <i className="icon icon-line-tool fa-2x" />

    getTool = ref => <LineTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

    onSelect() {
      super.onSelect();
      if (this.props.selectedPathIds.length) this.props.deselectAll();
    }

    onPathAdd = path => {
      path.remove();
      this.props.newPath({
        type: this.TOOL_NAME,
        pathData: path.pathData,
        strokeColor: 'black',
      });
    }

    TOOL_NAME = 'Line'
    Container = Container
  };
