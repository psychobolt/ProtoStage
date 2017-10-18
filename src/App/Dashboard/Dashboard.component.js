import React from 'react';

import Menu from './Menu';
import styles from './Dashboard.styles';

const Dashboard = () => (
  <x-box style={styles.container}>
    <Menu />
    <x-box vertical style={styles.content}>
      <x-card style={styles.card}>
        <header>
          <h3><strong>Announcments</strong></h3>
        </header>
        <main>
          <strong>Title</strong>
          <p>Content</p>
        </main>
      </x-card>
      <x-card style={styles.card}>
        <header>
          <h3><strong>Tutorials</strong></h3>
        </header>
        <main>
          <strong>Title</strong>
          <p>Content</p>
        </main>
      </x-card>
    </x-box>
  </x-box>
);

export default Dashboard;
