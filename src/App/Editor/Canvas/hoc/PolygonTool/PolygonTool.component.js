import React from 'react';
import { connect } from 'react-redux';
import { PolygonTool } from '@psychobolt/react-paperjs-editor';

import { getCanvas } from 'App/App.selectors';

import { addPath, removePaths, updatePaths, selectPaths, deselectAll } from '../../Canvas.actions';
import { Tool } from '../shared/Tool';

export function getProperties(path) {
  const { x, y } = path.position;
  return {
    position: { x, y },
    points: path.segments.map(segment => ({ x: segment.point.x, y: segment.point.y })),
  };
}

export default Container => @connect(
  state => {
    const { paths, selectedPathIds, activeTool, activeLayer } = getCanvas(state);
    return { paths, selectedPathIds, lastActiveTool: activeTool, activeLayer };
  },
  dispatch => ({
    newPath: (path, skipHistory) => {
      const newPath = addPath(path, skipHistory);
      dispatch(newPath);
      return newPath.payload.id;
    },
    removePaths: id => dispatch(removePaths(id)),
    updatePath: path => dispatch(updatePaths([path])),
    selectPath: id => dispatch(selectPaths([id])),
    deselectAll: skipHistory => dispatch(deselectAll(skipHistory)),
  }),
)
  class extends Tool {
    state = {
      pathId: null,
      pathData: '',
    }

    componentWillReceiveProps({ selectedPathIds, paths, lastActiveTool }) {
      let { pathId } = this.state;
      if (selectedPathIds.includes(pathId) && lastActiveTool !== this.TOOL_NAME
          && !paths[pathId].closed) {
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

    getTool = ref => {
      const { pathData } = this.state; // eslint-disable-line react/no-this-in-sfc
      return <PolygonTool pathData={pathData} key={`${this.TOOL_NAME}Tool`} ref={ref} onSegmentAdd={this.onSegmentAdd} onPathAdd={this.onPathAdd} />; // eslint-disable-line react/no-this-in-sfc
    }

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
          visible: false,
          layer: this.props.activeLayer,
        });
        this.props.selectPath(pathId, true);
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
      path.remove();
      this.props.updatePath({
        type: 'Path',
        id: this.state.pathId,
        pathData: path.pathData,
        layer: this.props.activeLayer,
        strokeColor: 'black',
        fillColor: 'white',
        visible: true,
        closed: true,
        properties: getProperties(path),
      });
      this.props.deselectAll(true);
      this.setState({ pathId: null, pathData: '' });
      this.path = null;
    }

    TOOL_NAME = 'Polygon'

    Container = Container

    history = [];
};
