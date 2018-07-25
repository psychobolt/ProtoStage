import React from 'react';
import { connect } from 'react-redux';
import { FreeformPathTool } from '@psychobolt/react-paperjs-editor';

import { getCanvas } from 'App/App.selectors';

import { addPath, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

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
    getIcon = () => <i className="fa fa-pencil fa-2x" />

    getTool = ref => <FreeformPathTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} /> // eslint-disable-line react/no-this-in-sfc

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

    TOOL_NAME = 'Pencil'

    Container = Container
};
