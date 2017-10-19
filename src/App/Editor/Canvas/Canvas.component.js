// @flow
import React from 'react';
import { View } from 'react-paper-bindings';

import withResizableContainer from 'Framework/ReactResizableContainer';

type Props = {
  containerWidth: number,
  containerHeight: number,
  registerResizeListener: () => void
};

class Canvas extends React.Component<Props> {
  componentDidMount() {
    this.props.registerResizeListener();
  }

  render() {
    const { containerWidth, containerHeight } = this.props;
    return <View width={containerWidth} height={containerHeight} />;
  }
}

export default withResizableContainer(Canvas);
