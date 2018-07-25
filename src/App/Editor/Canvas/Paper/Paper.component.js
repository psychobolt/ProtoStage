// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import { renderWithPaperScope, PaperContainer } from '@psychobolt/react-paperjs';
import { PanAndZoom, Grid } from '@psychobolt/react-paperjs-editor';
import typeof { Event } from 'paper';

import * as styles from './Paper.style';

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

const eventHandler = (handlers = []) => (event: Event) => handlers
  .forEach((handler: EventHandler) => (handler ? handler(event) : noop()));

const Container = styled(PaperContainer)`
  ${styles.container}
`;

export default class Paper extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.container = React.createRef();
  }

  onResize = () => {
    this.forceUpdate();
  }

  onFocus = () => this.container.current.canvas.current.focus()

  container: typeof PaperContainer;

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
        innerRef={this.container}
        canvasProps={{
          resize: 'true',
          style: {
            cursor,
          },
          tabIndex: 0,
        }}
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
      >
        <PanAndZoom
          onPanEnabled={onPanEnabled}
          onPanDisabled={onPanDisabled}
          onZoom={onZoom}
          zoomLevel={viewZoom}
          center={[0, 0]}
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
        </PanAndZoom>
      </Container>
    );
  }
}
