// @flow
import React from 'react';
import { RectangleTool } from '@psychobolt/react-paperjs';

import withTool from '../shared/Tool';

type Props = {
  instanceRef: Function
};

class SelectTool extends React.Component<Props> {
  onPathAdd = path => {
    path.remove();
  }

  ref = ref => {
    this.props.instanceRef(ref);
    this.tool = ref;
  }

  tool: RectangleTool

  render() {
    return (
      <RectangleTool ref={this.ref} onPathAdd={this.onPathAdd} />
    );
  }
}

const TOOL_NAME = 'Select';

export default withTool({
  TOOL_NAME,
  getIcon: () => <i className="fa fa-mouse-pointer fa-2x" />,
  getTool: ref => <SelectTool key={`${TOOL_NAME}Tool`} instanceRef={ref} />,
});
