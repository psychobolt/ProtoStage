import React from 'react';
import { connect } from 'react-redux';
import { CircleTool } from '@psychobolt/react-paperjs';

import { getCanvas } from 'App/App.selectors';

import { addPath, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export const SHAPE = 'Circle';

export function getProperties(path) {
  const { x, y } = path.position;
  return {
    position: { x, y },
    radius: path.bounds.width / 2,
  };
}

export default Container =>
  @connect(
    state => {
      const { selectedPathIds, activeLayer, autoSync } = getCanvas(state);
      return { selectedPathIds, activeLayer, autoSync };
    },
    dispatch => ({
      newPath: (path, skipHistory) => dispatch(addPath(path, skipHistory)),
      deselectAll: () => dispatch(deselectAll()),
    }),
  )
  class extends Tool {
    getIcon = () => <i className="icon icon-circle-tool fa-2x" />

    getTool = ref => <CircleTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

    onSelect() {
      super.onSelect();
      if (this.props.selectedPathIds.length) this.props.deselectAll();
    }

    onPathAdd = path => {
      path.remove();
      this.props.newPath({
        type: SHAPE,
        pathData: path.pathData,
        strokeColor: 'black',
        fillColor: 'white',
        layer: this.props.activeLayer,
        properties: getProperties(path),
      });
    }

    TOOL_NAME = SHAPE
    Container = Container
  };
