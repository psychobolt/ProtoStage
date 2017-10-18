// @flow
import React from 'react';
import { View } from 'react-paper-bindings';

type Props = {
  style: {
    container: {}
  }
};

type State = {
  width?: number,
  height?: number,
  mounted: boolean
};

export default class Canvas extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    if (this.container) {
      this.onMount(() => this.setState({
        ...this.getDimensions(),
        mounted: true,
      }));
      window.addEventListener('resize', this.resize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onMount = (callback: () => mixed) => {
    callback();
  }

  getDimensions() {
    if (this.container) {
      const box = this.container.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
      };
    }
    return {};
  }

  resize = () => {
    this.setState(this.getDimensions());
  }

  container: ?HTMLDivElement;

  render() {
    const { style } = this.props;
    const { mounted, width, height } = this.state;
    return (
      <div style={style.container} ref={ref => { this.container = ref; }}>
        {mounted && <View width={width} height={height} />}
      </div>
    );
  }
}
