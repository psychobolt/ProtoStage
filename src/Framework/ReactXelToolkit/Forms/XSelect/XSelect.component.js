// @flow
import React, { type Node } from 'react';

type Props = {
  onChange?: (event: CustomEvent, value: number) => any,
  children: Node
}

export default class XSelect extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
  }

  componentDidMount() {
    const { onChange } = this.props;
    if (this.select) this.select.addEventListener('change', onChange);
  }

  componentWillUnmount() {
    const { onChange } = this.props;
    if (this.select) this.select.removeEventListener('change', onChange);
  }

  setSelect = (ref: ?HTMLElement) => { this.select = ref; };

  select: ?HTMLElement

  render() {
    const { onChange, children, ...rest } = this.props;
    return (
      <x-select ref={this.setSelect} {...rest}>
        {children}
      </x-select>
    );
  }
}
