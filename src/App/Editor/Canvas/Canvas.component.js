// @flow
import React from 'react';
import { PaperScope } from 'paper/dist/paper-core';

import withResizableContainer from 'Framework/ReactResizableContainer';

type Props = {
  containerWidth: number,
  containerHeight: number,
  registerResizeListener: () => void
};

class Canvas extends React.Component<Props> {
  componentDidMount() {
    this.props.registerResizeListener();

    this.paper = new PaperScope();
    this.paper.setup(this.canvas);
  }

  canvas: ?HTMLCanvasElement
  paper: PaperScope

  render() {
    const { containerWidth, containerHeight } = this.props;
    return (
      <canvas
        width={containerWidth}
        height={containerHeight}
        ref={el => { this.canvas = el; }}
      />
    );
  }
}

export default withResizableContainer(Canvas);
