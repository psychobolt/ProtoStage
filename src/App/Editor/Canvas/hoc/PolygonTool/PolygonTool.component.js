import React from 'react';
import { connect } from 'react-redux';
import { PolygonTool } from '@psychobolt/react-paperjs';

import { addPath, updatePath } from '../../Canvas.actions';
import { getCanvas } from '../../Canvas.selectors';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(
    state => {
      const { paths, selectedPathIds } = getCanvas(state.editor);
      return { paths, selectedPathIds };
    },
    dispatch => ({
      newPath: path => {
        const newPath = addPath(path);
        dispatch(newPath);
        return newPath.payload.id;
      },
      updatePath: path => dispatch(updatePath(path)),
    }),
  )
  class extends Tool {
    state = {
      pathId: null,
      pathData: '',
    }

    componentWillReceiveProps({ selectedPathIds, paths }) {
      super.componentDidUpdate();
      const pathId = selectedPathIds.find(id => this.history.indexOf(id) > -1);
      const path = paths[pathId];
      if (path && (pathId !== this.state.pathId || path.pathData !== this.state.pathData)) {
        this.setState({ pathId, pathData: path.pathData });
      }
    }

    getIcon = () => <i className="icon icon-closed-shape-tool fa-2x" />

    getTool = ref => <PolygonTool pathData={this.state.pathData} key={`${this.TOOL_NAME}Tool`} ref={ref} onSegmentAdd={this.onSegmentAdd} onPathAdd={this.onPathAdd} />

    onSegmentAdd = (segment, path) => {
      const { pathData } = path;
      let { pathId } = this.state;
      if (pathId == null) {
        pathId = this.props.newPath({
          type: 'Path',
          pathData,
          selected: true,
          visible: false,
        });
        this.history.push(pathId);
        this.setState({ pathId, pathData });
      } else {
        this.props.updatePath({
          type: 'Path',
          id: pathId,
          pathData,
        });
      }
    }

    onPathAdd = path => {
      this.props.updatePath({
        type: 'Path',
        id: this.state.pathId,
        pathData: path.pathData,
        strokeColor: 'black',
        fillColor: 'white',
        selected: false,
        visible: true,
        closed: true,
      });
      this.setState({ pathId: null, pathData: '' });
    }

    TOOL_NAME = 'Polygon'
    Container = Container
    history = [];
  };
