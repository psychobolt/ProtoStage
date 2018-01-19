import React from 'react';
import { connect } from 'react-redux';
import { Tool } from '@psychobolt/react-paperjs';

import { getCanvas } from 'App/App.selectors';

import { updatePaths, selectPaths, deselectAll } from '../../Canvas.actions';
import * as Circle from '../CircleTool';
import * as Line from '../LineTool';
import * as Polygon from '../PolygonTool';
import * as Rectangle from '../RectangleTool';
import { Tool as ToolComponent } from '../shared/Tool';

const MOUSE_LEFT_CODE = 0;
const CURSOR_MOVE = 'move';

function getProperties(type, path) {
  switch (type) {
    case Line.SHAPE: return Line.getProperties(path);
    case Rectangle.SHAPE: return Rectangle.getProperties(path);
    case Circle.SHAPE: return Circle.getProperties(path);
    case 'Path': {
      if (path.closed) return Polygon.getProperties(path);
      return null;
    }
    default: return null;
  }
}

export default Container =>
  @connect(
    state => {
      const { selectedPathIds, paths } = getCanvas(state);
      return { selectedPathIds, paths };
    },
    dispatch => ({
      updatePaths: paths => dispatch(updatePaths(paths)),
      selectPath: id => dispatch(selectPaths([id])),
      deselectAll: skipHistory => dispatch(deselectAll(skipHistory)),
    }),
  )
  class MoveTool extends ToolComponent {
    getIcon = () => <i className="fa fa-arrows fa-2x" />

    getTool = ref => <Tool key={`${this.TOOL_NAME}Tool`} onMouseMove={this.onMouseMove} onMouseDown={this.onMouseDown} onMouseDrag={this.onMouseDrag} onMouseUp={this.onMouseUp} ref={ref} />

    onMouseMove = event => {
      const { cursor, setCursor } = this.props;
      const { item } = event;
      if (cursor !== CURSOR_MOVE && item && typeof item.data.pathId !== 'undefined') {
        setCursor(CURSOR_MOVE);
      } else if (cursor === CURSOR_MOVE && !item) {
        setCursor('auto');
      }
    }

    onMouseDown = toolEvent => {
      if (toolEvent.event.button === MOUSE_LEFT_CODE) {
        const { selectedPathIds } = this.props;
        const { item } = toolEvent;
        if (item) {
          const { pathId } = item.data;
          if (!this.selected && typeof pathId !== 'undefined') {
            if (!selectedPathIds.includes(pathId)) {
              this.props.deselectAll(true);
              this.props.selectPath(pathId);
              this.items = [item];
            } else {
              this.items = item.project.selectedItems;
            }
            this.selected = item;
            this.start = item.position;
            return;
          }
        }
        if (selectedPathIds.length) {
          this.props.deselectAll();
        }
      }
    }

    onMouseDrag = toolEvent => {
      const { items } = this;
      if (items.length && toolEvent.event.buttons === 1) {
        items.forEach(item => item.translate(toolEvent.delta));
      }
    }

    onMouseUp = () => {
      const { selected, items } = this;
      if (items.length) {
        if (!selected.position.equals(this.start)) {
          const { paths } = this.props;
          this.props.updatePaths(items.map(item => {
            const { pathId } = item.data;
            const path = paths[pathId];
            return {
              id: pathId,
              pathData: item.pathData,
              properties: getProperties(path.type, item),
            };
          }));
        }
        this.items = [];
        this.selected = null;
        this.start = null;
      }
    }

    TOOL_NAME = 'Move'
    Container = Container
    items = [];
  };
