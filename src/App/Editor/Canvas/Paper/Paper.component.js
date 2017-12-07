// @flow
import React, { type Node } from 'react';
import { withPanAndZoom, renderWithPaperScope, PaperContainer, Grid } from '@psychobolt/react-paperjs';
import typeof { Event } from 'paper';

const Container = withPanAndZoom(PaperContainer);

export type EventHandler = (event: Object) => any;

type Props = {
  onKeyDown: EventHandler,
  onKeyUp: EventHandler,
  onMouseDown: EventHandler,
  onMouseUp: EventHandler,
  onMouseEnter: EventHandler,
  onMouseLeave: EventHandler,
  onMouseMove: EventHandler,
  onPanEnabled: Function,
  onPanDisabled: Function,
  children: Node
};

function eventHandler(handler) {
  return handler ? (event: Event) => handler(event) : null;
}

export default class Paper extends React.Component<Props> {
  onResize = () => {
    this.forceUpdate();
  }

  render() {
    const {
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
    } = this.props;
    return (
      <Container
        canvasProps={{
          resize: 'true',
          style: {
            width: '100%',
            height: '100%',
          },
        }}
        viewProps={{
          onKeyUp: eventHandler(onKeyUp),
          onKeyDown: eventHandler(onKeyDown),
          onMouseUp: eventHandler(onMouseUp),
          onMouseDown: eventHandler(onMouseDown),
          onMouseEnter: eventHandler(onMouseEnter),
          onMouseLeave: eventHandler(onMouseLeave),
          onMouseMove: eventHandler(onMouseMove),
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
            />
          );
        })}
        {children}
      </Container>
    );
  }
}
