// @flow
import React, { type Node } from 'react';

type Props = {
  onChange: (event: CustomEvent, value: number) => any,
  children: Node
}

export default class XNumberInput extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
  }

  componentDidMount() {
    if (this.input) this.input.addEventListener('change', this.onChange);
  }

  componentWillUnmount() {
    if (this.input) this.input.removeEventListener('change', this.onChange);
  }

  onChange = (event: CustomEvent) => {
    if (this.input) {
      const value = parseFloat(this.input.getAttribute('value') || '', 10);
      if (this.value !== value) this.props.onChange(event, value);
    }
  }

  setInput = (ref: ?HTMLElement) => { this.input = ref; };

  input: ?HTMLElement
  value: number

  render() {
    const { onChange, children, ...rest } = this.props;
    return (
      <x-numberinput ref={this.setInput} {...rest}>
        {children}
      </x-numberinput>
    );
  }
}
