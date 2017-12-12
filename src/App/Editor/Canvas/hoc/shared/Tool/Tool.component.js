// @flow
import React, { type Node, type Element } from 'react';
import { connect } from 'react-redux';
import { Slice } from 'react-pie-menu';

import typeof { PaperContainer, InstanceRef } from '@psychobolt/react-paperjs';

export type Props = {
  menuSlices: Node[],
  activeTool: string,
  setActiveTool: (activeTool: string) => void,
  children: Node
};

interface ITool {
  TOOL_NAME: string,
  getIcon: () => Node,
  getTool: (ref: Function) => ?Element<*>,
}

export class Tool extends React.Component<Props> implements ITool {
  static defaultProps = {
    menuSlices: [],
  }

  constructor(props: Props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.prepare();
  }

  componentDidUpdate() {
    this.prepare();
  }

  onSelect: () => void
  onSelect() {
    this.props.setActiveTool(this.TOOL_NAME);
  }

  getIcon = () => null;

  getTool = () => null; // eslint-disable-line no-unused-vars

  prepare = () => {
    if (this.props.activeTool === this.TOOL_NAME) {
      if (this.tool) this.tool.activate();
    }
  }

  ref = (ref: InstanceRef) => {
    this.tool = ref ? ref.instance : null;
  }

  TOOL_NAME: string;
  tool: ?Object;
  Container: PaperContainer;

  render() {
    const { activeTool, setActiveTool, menuSlices, children, ...rest } = this.props;
    const { TOOL_NAME, Container, getIcon, getTool, onSelect } = this;
    const icon = getIcon();
    return (
      <Container
        menuSlices={[
          ...menuSlices,
          ...(icon ? [<Slice key={TOOL_NAME} onSelect={onSelect}>{icon}</Slice>] : []),
        ]}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        {...rest}
      >
        {[
          getTool(this.ref),
          ...(Array.isArray(children) ? children : React.Children.toArray(children)),
        ]}
      </Container>
    );
  }
}

interface ReduxTool extends ITool {
  mapStateToProps: (state: {}) => {},
  mapDispatchToProps: (dispatch: Function) => {}
}

export default (tool: ReduxTool) => (Container: PaperContainer) => {
  const { mapStateToProps, mapDispatchToProps, getTool, ...rest } = tool;
  return connect(mapStateToProps, mapDispatchToProps)(class extends Tool {
    constructor(props: Props) {
      super(props);
      Object.assign(this, rest, {
        getTool: getTool.bind(this),
        Container,
      });
    }
  });
};
