// @flow
import React from 'react';
import { connect, type Connector } from 'react-redux';

import Canvas, { getCanvas } from './Canvas';
import World from './World';
import styles from './Editor.style';
import { type Canvas as CanvasProps } from './Canvas/Canvas.state';

type Props = {
  canvas: CanvasProps
};

const Editor = ({ canvas }: Props) => (
  <x-box style={styles.container}>
    <div style={styles.panel}><Canvas {...canvas} /></div>
    <div style={styles.divider} />
    <div style={styles.panel}><World /></div>
  </x-box>
);

const connector: Connector<Props> = connect(state => ({
  canvas: getCanvas(state.editor),
}));

export default connector(Editor);
