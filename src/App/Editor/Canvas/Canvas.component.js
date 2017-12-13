// @flow
import React from 'react';
import { connect } from 'react-redux';
import PieMenu from 'react-pie-menu';
import { withStateHandlers, compose } from 'recompose';
import { defaultMemoize } from 'reselect';
import typeof { MouseEvent, KeyEvent } from 'paper';

import './assets/fontello/css/icon.css';
import './assets/fontello/css/fontello.css';
import {
  NOOP_TOOL_NAME,
  withNoopTool,
  withMoveTool,
  withPencilTool,
  withSelectTool,
  withLineTool,
  withRectangleTool,
  withCircleTool,
  withPolygonTool,
  type ToolProps,
} from './hoc';
import Paper from './Paper';
import { selectTool } from './Canvas.actions';
import { type Canvas as CanvasProps } from './Canvas.state';
import { getCanvas } from './Canvas.selectors';
import styles from './Canvas.style';

type Props = CanvasProps & ToolProps;

type State = {
  mouseX: ?string,
  mouseY: ?string,
  menuX: ?string,
  menuY: ?string,
  enableMenu: boolean,
  focused: boolean,
};

const MOUSE_RIGHT_CODE = 2;

class Canvas extends React.Component<Props, State> {
  static defaultProps = {
    menuSlices: [],
  };

  state = {
    mouseX: null,
    mouseY: null,
    menuX: null,
    menuY: null,
    enableMenu: false,
    focused: false,
  }

  onContextMenu = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  onKeyDown = (event: KeyEvent) => {
    if (event.key === 'control' && !this.state.enableMenu) {
      this.setState({ enableMenu: true });
    }
  }

  onKeyUp = (event: KeyEvent) => {
    if (event.key === 'control') {
      this.setState({ enableMenu: false });
    }
  }

  onMouseDown = (e: MouseEvent) => {
    const { menuX, menuY } = this.state;
    if (this.state.enableMenu && !menuX && !menuY && e.event.button === MOUSE_RIGHT_CODE) {
      this.setState({
        menuX: `${e.event.pageX}px`,
        menuY: `${e.event.pageY}px`,
      });
    }
  }

  onMouseUp = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    if (this.state.enableMenu && e.button === MOUSE_RIGHT_CODE) {
      this.setState({
        menuX: null,
        menuY: null,
      });
      e.preventDefault();
    }
  }

  onMouseEnter = () => {
    this.setState({ focused: true });
  }

  onMouseMove = (event: MouseEvent) => {
    if (this.state.focused) {
      const { x, y } = event.point;
      this.setState({
        mouseX: `${x.toFixed()}px`,
        mouseY: `${y.toFixed()}px`,
      });
    }
  }

  onMouseLeave = () => {
    this.setState({
      mouseX: null,
      mouseY: null,
      focused: false,
    });
  }

  onPanEnabled = () => {
    const { activeTool, setActiveTool } = this.props;
    if (activeTool !== NOOP_TOOL_NAME) {
      this.lastActiveTool = activeTool;
    }
    setActiveTool(NOOP_TOOL_NAME);
  }

  onPanDisabled = () => {
    this.props.setActiveTool(this.lastActiveTool);
  }

  getPaths = defaultMemoize((pathIds, paths) => pathIds.map(pathId => {
    const { id, type: Path, ...rest } = paths[pathId];
    return <Path data={{ pathId: id }} key={`path_${id}`} {...rest} />;
  }))

  lastActiveTool: string;

  render() {
    const { menuSlices, pathIds, paths, children, cursor } = this.props;
    const { mouseX, mouseY, menuX, menuY, enableMenu } = this.state;
    return (
      <div
        role="presentation"
        style={styles.container}
        onContextMenu={this.onContextMenu}
        onMouseUp={this.onMouseUp}
      >
        <Paper
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onPanEnabled={this.onPanEnabled}
          onPanDisabled={this.onPanDisabled}
          cursor={cursor}
        >
          {this.getPaths(pathIds, paths)}
          {children}
        </Paper>
        {mouseX && mouseY && <div style={styles.statOverlay}><x-label>{` x=${mouseX}  y=${mouseY}`}</x-label></div>}
        {menuSlices.length && enableMenu && menuX && menuY &&
          <PieMenu centerX={menuX} centerY={menuY}>
            {menuSlices}
            {/*
            <Slice><i className="fa fa-i-cursor fa-2x" /></Slice>
            */}
          </PieMenu>
        }
      </div>
    );
  }
}

export default compose(
  connect(
    state => {
      const { activeTool } = getCanvas(state.editor);
      return { lastActiveTool: activeTool };
    },
    dispatch => ({ storeToolHistory: tool => dispatch(selectTool(tool)) }),
  ),
  withStateHandlers(
    { activeTool: 'Select', cursor: 'auto' },
    {
      setActiveTool: (state, props) => (activeTool: string) => {
        props.storeToolHistory(activeTool);
        return { activeTool };
      },
      setCursor: () => (cursor: string) => ({ cursor }),
    },
  ),
  withNoopTool,
  withSelectTool,
  withMoveTool,
  withPencilTool,
  withLineTool,
  withRectangleTool,
  withCircleTool,
  withPolygonTool,
)(Canvas);
