import React from 'react';

import Canvas from './Canvas';
import World from './World';
import styles from './Editor.style';

const Editor = () => (
  <x-box style={styles.container}>
    <div style={styles.panel}><Canvas /></div>
    <div style={styles.divider} />
    <div style={styles.panel}><World /></div>
  </x-box>
);

export default Editor;
