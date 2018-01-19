// @flow
import React, { type Node } from 'react';
import { withPanAndZoom, renderWithPaperScope, PaperContainer, Grid } from '@psychobolt/react-paperjs';
import typeof { Event } from 'paper';

import styles from './Paper.style';

const Container = withPanAndZoom(PaperContainer);

export type EventHandler = (event: Object) => any;

type Props = {
  viewZoom: number,
  onKeyDown: EventHandler,
  onKeyUp: EventHandler,
  onMouseDown: EventHandler,
  onMouseUp: EventHandler,
  onMouseEnter: EventHandler,
  onMouseLeave: EventHandler,
  onMouseMove: EventHandler,
  onPanEnabled: Function,
  onPanDisabled: Function,
  onZoom: Function,
  gridSpacing: number,
  cursor: string,
  children: Node
};

const noop = () => {};

const eventHandler = (handlers = []) => (event: Event) =>
  handlers.forEach((handler: EventHandler) => (handler ? handler(event) : noop()));

export default class Paper extends React.Component<Props> {
  onResize = () => {
    this.forceUpdate();
  }

  onFocus = () => {
    const { container } = this.container;
    container.canvas.focus();
  }

  setContainer = (ref: typeof Container) => { this.container = ref; }

  container: typeof Container;

  render() {
    const {
      viewZoom,
      onKeyUp,
      onKeyDown,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      children,
      onPanEnabled,
      onPanDisabled,
      onZoom,
      gridSpacing,
      cursor,
    } = this.props;
    return (
      <Container
        ref={this.setContainer}
        canvasProps={{
          resize: 'true',
          style: {
            ...styles.canvas,
            cursor,
          },
          tabIndex: 0,
        }}
        viewZoom={viewZoom}
        viewCenter={[0, 0]}
        viewProps={{
          onKeyUp: eventHandler([onKeyUp]),
          onKeyDown: eventHandler([onKeyDown]),
          onMouseUp: eventHandler([onMouseUp]),
          onMouseDown: eventHandler([onMouseDown, this.onFocus]),
          onMouseEnter: eventHandler([onMouseEnter]),
          onMouseLeave: eventHandler([onMouseLeave]),
          onMouseMove: eventHandler([onMouseMove]),
          onResize: this.onResize,
        }}
        prepanStyle={{
          cursor: '-webkit-grab',
        }}
        panStyle={{
          cursor: '-webkit-grabbing',
        }}
        onPanEnabled={onPanEnabled}
        onPanDisabled={onPanDisabled}
        onZoom={onZoom}
      >
        {renderWithPaperScope(paper => {
          const { top, left, right, bottom } = paper.view.bounds;
          return (
            <Grid
              width="100%"
              height="100%"
              top={top}
              left={left}
              right={right}
              bottom={bottom}
              strokeWidth={1 / paper.view.zoom}
              cellSize={gridSpacing}
            />
          );
        })}
        {children}
      </Container>
    );
  }
}
