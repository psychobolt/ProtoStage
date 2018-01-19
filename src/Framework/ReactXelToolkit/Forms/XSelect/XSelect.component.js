// @flow
import React, { type Node } from 'react';

type Props = {
  onChange: (event: CustomEvent, value: number) => any,
  children: Node
}

export default class XSelect extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
  }

  componentDidMount() {
    if (this.select) this.select.addEventListener('change', this.props.onChange);
  }

  componentWillUnmount() {
    if (this.select) this.select.removeEventListener('change', this.props.onChange);
  }

  setSelect = (ref: ?HTMLElement) => { this.select = ref; };

  select: ?HTMLElement

  render() {
    const { onChange, children, ...rest } = this.props;
    return <x-select ref={this.setSelect} {...rest}>{children}</x-select>;
  }
}
