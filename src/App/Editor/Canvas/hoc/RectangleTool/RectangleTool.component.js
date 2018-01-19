import React from 'react';
import { connect } from 'react-redux';
import { RectangleTool } from '@psychobolt/react-paperjs';

import { getCanvas } from 'App/App.selectors';

import { addPath, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export const SHAPE = 'Rectangle';

export function getProperties(path) {
  const { x, y } = path.position;
  const { width, height } = path.bounds;
  return {
    position: { x, y },
    width,
    height,
  };
}

export default Container =>
  @connect(
    state => {
      const { paths, selectedPathIds, activeLayer } = getCanvas(state);
      return { paths, selectedPathIds, activeLayer };
    },
    dispatch => ({
      newPath: (path, skipHistory) => dispatch(addPath(path, skipHistory)),
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
