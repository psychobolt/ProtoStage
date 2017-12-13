import React from 'react';
import { connect } from 'react-redux';
import { Tool } from '@psychobolt/react-paperjs';

import { updatePaths, selectPath, deselectAll } from '../../Canvas.actions';
import { getCanvas } from '../../Canvas.selectors';
import { Tool as ToolComponent } from '../shared/Tool';

const MOUSE_LEFT_CODE = 0;
const CURSOR_MOVE = 'move';

export default Container =>
  @connect(
    state => {
      const { selectedPathIds } = getCanvas(state.editor);
      return { selectedPathIds };
    },
    dispatch => ({
      updatePaths: paths => dispatch(updatePaths(paths)),
      selectPath: ids => dispatch(selectPath(ids)),
      deselectAll: () => dispatch(deselectAll()),
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
          this.props.updatePaths(items.map(item => ({
            id: item.data.pathId,
            pathData: item.pathData,
          })));
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
