import React from 'react';
import { connect } from 'react-redux';
import { PolygonTool } from '@psychobolt/react-paperjs';

import { addPath, removePaths, updatePaths, deselectAll } from '../../Canvas.actions';
import { getCanvas } from '../../Canvas.selectors';
import { Tool } from '../shared/Tool';

export default Container =>
  @connect(
    state => {
      const { paths, selectedPathIds, activeTool } = getCanvas(state.editor);
      return { paths, selectedPathIds, lastActiveTool: activeTool };
    },
    dispatch => ({
      newPath: path => {
        const newPath = addPath(path);
        dispatch(newPath);
        return newPath.payload.id;
      },
      removePaths: id => dispatch(removePaths(id)),
      updatePath: path => dispatch(updatePaths([path])),
      deselectAll: () => dispatch(deselectAll()),
    }),
  )
  class extends Tool {
    state = {
      pathId: null,
      pathData: '',
    }

    componentWillReceiveProps({ selectedPathIds, paths, lastActiveTool }) {
      let { pathId } = this.state;
      if (selectedPathIds.includes(pathId) && lastActiveTool !== this.TOOL_NAME && !paths[pathId].closed) {
        this.props.removePaths([pathId]);
        this.setState({ pathId: null, pathData: '' });
      } else {
        pathId = selectedPathIds.find(id => this.history.includes(id));
        const path = paths[pathId];
        const pathData = path ? path.pathData : '';
        if (pathId !== this.state.pathId || pathData !== this.state.pathData) {
          this.setState({ pathId, pathData });
        }
      }
    }

    getIcon = () => <i className="icon icon-closed-shape-tool fa-2x" />

    getTool = ref => <PolygonTool pathData={this.state.pathData} key={`${this.TOOL_NAME}Tool`} ref={ref} onSegmentAdd={this.onSegmentAdd} onPathAdd={this.onPathAdd} />

    onSelect() {
      super.onSelect();
      if (this.props.selectedPathIds.length) this.props.deselectAll();
    }

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
      this.path = null;
    }

    TOOL_NAME = 'Polygon'
    Container = Container
    history = [];
  };
