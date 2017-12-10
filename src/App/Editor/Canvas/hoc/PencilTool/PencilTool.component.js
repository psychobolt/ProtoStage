import React from 'react';
import { connect } from 'react-redux';
import { FreeformPathTool } from '@psychobolt/react-paperjs';

import { addPath } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(undefined, dispatch => ({
    newPath: path => dispatch(addPath(path)),
  }))
  class extends Tool {
    getIcon = () => <i className="fa fa-pencil fa-2x" />

    getTool = ref => <FreeformPathTool key={`${this.TOOL_NAME}Tool`} ref={ref} onPathAdd={this.onPathAdd} />

    onPathAdd = path => {
      path.remove();
      this.props.newPath({
        type: 'Path',
        pathData: path.pathData,
        strokeColor: 'black',
      });
    }

    TOOL_NAME = 'Pencil'
    Container = Container
  };
