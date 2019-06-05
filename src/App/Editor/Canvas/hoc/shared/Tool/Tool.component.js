// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Slice } from 'react-pie-menu';

import typeof { PaperContainer } from '@psychobolt/react-paperjs';

export type Props = {
  menuSlices?: Node[],
  activeTool: string,
  setActiveTool: (activeTool: string) => void,
  children: Node
};

interface ITool {
  TOOL_NAME: string,
  getIcon: () => Node,
  getTool: (ref: React.Ref<any>) => ?React.Element<*>,
}

export class Tool extends React.Component<Props> implements ITool {
  static defaultProps = {
    menuSlices: [],
  }

  TOOL_NAME: string;

  Container: PaperContainer;

  constructor(props: Props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.prepare();
  }

  componentDidUpdate(prevProps: Props) {
    const { activeTool } = this.props;
    if (activeTool !== prevProps.activeTool) {
      this.prepare();
    }
  }

  onSelect() {
    const { setActiveTool } = this.props;
    setActiveTool(this.TOOL_NAME);
  }

  getIcon = () => null;

  getTool = (ref: React.Ref<any>) => null; // eslint-disable-line no-unused-vars

  prepare = () => {
    const { activeTool } = this.props;
    if (activeTool === this.TOOL_NAME) {
      if (this.ref.current) this.ref.current.activate();
    }
  }

  render() {
    const { activeTool, setActiveTool, menuSlices, children, ...rest } = this.props;
    const { TOOL_NAME, Container, getIcon, getTool, onSelect } = this;
    const icon = getIcon();
    return (
      <Container
        menuSlices={[
          ...menuSlices,
          ...(icon ? [
            <Slice key={TOOL_NAME} onSelect={onSelect}>
              {icon}
            </Slice>,
          ] : []),
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
