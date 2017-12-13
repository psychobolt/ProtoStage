import React from 'react';
import { connect } from 'react-redux';
import { RectangleTool } from '@psychobolt/react-paperjs';

import { selectPaths, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(undefined, dispatch => ({
    selectPaths: ids => dispatch(selectPaths(ids)),
    deselectAll: () => dispatch(deselectAll()),
  }))
  class SelectTool extends Tool {
    getIcon = () => <i className="fa fa-mouse-pointer fa-2x" />

    getTool = ref => <RectangleTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

    onPathAdd = path => {
      const { project, bounds } = path;
      path.remove();
      const items = project.activeLayer.getItems({ overlapping: bounds })
        .map(item => item.data.pathId);
      if (items.length) this.props.selectPaths(items);
      else this.props.deselectAll();
    }

    TOOL_NAME = 'Select'
    Container = Container
  };
