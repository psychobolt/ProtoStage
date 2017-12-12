import React from 'react';
import { connect } from 'react-redux';
import { RectangleTool } from '@psychobolt/react-paperjs';

import { addPath, deselectAll } from '../../Canvas.actions';
import { getCanvas } from '../../Canvas.selectors';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(
    state => {
      const { paths, selectedPathIds } = getCanvas(state.editor);
      return { paths, selectedPathIds };
    },
    dispatch => ({
      newPath: path => dispatch(addPath(path)),
      deselectAll: () => dispatch(deselectAll()),
    }),
  )
  class extends Tool {
    getIcon = () => <i className="icon icon-rect-tool fa-2x" />

    getTool = ref => <RectangleTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

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
        fillColor: 'white',
      });
    }

    TOOL_NAME = 'Rectangle'
    Container = Container
  };
