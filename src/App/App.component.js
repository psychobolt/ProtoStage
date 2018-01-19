import React from 'react';
import { Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Editor from './Editor';
import styles from './App.style';

export default () => (
  <div style={styles.container}>
    <Route exact path="/" component={Dashboard} />
    <Route path="/project/:id?" component={Editor} />
  </div>
);
