import React from 'react';
import { connect } from 'react-redux';
import { RectangleTool } from '@psychobolt/react-paperjs-editor';

import { getCanvas } from 'App/App.selectors';

import { selectPaths, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export default Container => @connect(
  state => {
    const { selectedPathIds } = getCanvas(state);
    return { selectedPathIds };
  },
  dispatch => ({
    selectPaths: ids => dispatch(selectPaths(ids)),
    deselectAll: skipHistory => dispatch(deselectAll(skipHistory)),
  }),
)
  class SelectTool extends Tool {
    getIcon = () => <i className="fa fa-mouse-pointer fa-2x" />

    getTool = ref => <RectangleTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} /> // eslint-disable-line react/no-this-in-sfc

    onPathAdd = path => {
      const { project, bounds } = path;
      path.remove();
      const { layers } = project;
      const items = layers.slice(2, layers.length).reduce((collection, layer) => collection
        .concat(layer.getItems({ overlapping: bounds })), [])
        .map(item => item.data.pathId);
      if (items.length) {
        this.props.deselectAll(true);
        this.props.selectPaths(items);
      } else if (this.props.selectedPathIds.length) this.props.deselectAll();
    }

    TOOL_NAME = 'Select'

    Container = Container
};
