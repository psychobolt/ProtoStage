import React from 'react';

import Canvas from './Canvas';
import World from './World';
import styles from './Editor.style';

const Editor = () => (
  <x-box style={styles.container}>
    <Canvas style={{ container: styles.panel }} />
    <div style={styles.divider} />
    <World style={{ container: styles.panel }} />
  </x-box>
);

export default Editor;
