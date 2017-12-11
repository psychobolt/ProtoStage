// @flow
import React from 'react';
import { connect } from 'react-redux';
import { RectangleTool } from '@psychobolt/react-paperjs';

import { selectPaths, deselectAll } from '../../Canvas.actions';
import withTool from '../shared/Tool';

type Props = {
  instanceRef: Function,
  selectPaths: (ids: number[]) => void,
  deselectAll: () => void
};

// $FlowFixMe
@connect(undefined, dispatch => ({
  selectPaths: ids => dispatch(selectPaths(ids)),
  deselectAll: () => dispatch(deselectAll()),
}))
class SelectTool extends React.Component<Props> {
  onPathAdd = path => {
    const { project, bounds } = path;
    path.remove();
    const items = project.activeLayer.getItems({ overlapping: bounds })
      .map(item => item.data.pathId);
    if (items.length) this.props.selectPaths(items);
    else this.props.deselectAll();
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
