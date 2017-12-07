// @flow
import React from 'react';

type Props = {
  toggled: boolean,
  onClick: Function,
  children: any
};

export default ({ toggled = false, children, ...rest }: Props) => (
  <x-button {...rest} toggled={toggled || null}>
    <x-label>{children}</x-label>
  </x-button>
);
