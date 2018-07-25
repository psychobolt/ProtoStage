import React from 'react';
import { connect } from 'react-redux';
import { LineTool } from '@psychobolt/react-paperjs-editor';

import { getCanvas } from 'App/App.selectors';

import { addPath, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export const SHAPE = 'Line';

export function getProperties(path) {
  const { point: from } = path.firstSegment;
  const { point: to } = path.lastSegment;
  return {
    from: { x: from.x, y: from.y },
    to: { x: to.x, y: to.y },
  };
}

export default Container => @connect(
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
    getIcon = () => <i className="icon icon-line-tool fa-2x" />

    getTool = ref => <LineTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} /> // eslint-disable-line react/no-this-in-sfc

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
        layer: this.props.activeLayer,
        properties: getProperties(path),
      });
    }

    TOOL_NAME = SHAPE

    Container = Container
};
