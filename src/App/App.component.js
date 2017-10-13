import React from 'react';
import { Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import styles from './App.style';

export default () => (
  <div style={styles.container}>
    <Route path="/" component={Dashboard} />
  </div>
);
