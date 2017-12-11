import React from 'react';
import { connect } from 'react-redux';
import { CircleTool } from '@psychobolt/react-paperjs';

import { addPath } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(undefined, dispatch => ({
    newPath: path => dispatch(addPath(path)),
  }))
  class extends Tool {
    getIcon = () => <i className="icon icon-circle-tool fa-2x" />

    getTool = ref => <CircleTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

    onPathAdd = path => {
      path.remove();
      this.props.newPath({
        type: this.TOOL_NAME,
        pathData: path.pathData,
        strokeColor: 'black',
        fillColor: 'white',
      });
    }

    TOOL_NAME = 'Circle'
    Container = Container
  };
