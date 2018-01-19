// @flow
import React from 'react';
import { connect } from 'react-redux';

import { newProject } from '../../Project/Project.actions';
import styles from './Menu.styles';

type Props = {
  newProject: () => void
};

const Menu = (props: Props) => (
  <x-card style={styles.container}>
    <header>
      <strong>Pick A New App</strong>
    </header>
    <x-accordion expanded>
      <header>
        <x-label>2D/3D Simulation</x-label>
      </header>
      <main>
        <x-buttons style={styles.buttonContainer}>
          <x-box vertical style={styles.buttonContainer}>
            <x-button skin="nav" style={styles.button}>
              <x-label>Side-scrolling</x-label>
            </x-button>
            <x-button skin="nav" style={styles.button}>
              <x-label>Top-down</x-label>
            </x-button>
            <x-button onClick={props.newProject} skin="nav" style={styles.button}>
              <x-label>Custom</x-label>
            </x-button>
          </x-box>
        </x-buttons>
      </main>
    </x-accordion>
    <hr />
    <x-accordion expanded>
      <header>
        <x-label>Web Design</x-label>
      </header>
      <main>
        <x-buttons style={styles.buttonContainer}>
          <x-box vertical style={styles.buttonContainer}>
            <x-button skin="nav" style={styles.button}>
              <x-label>Coming soon</x-label>
            </x-button>
          </x-box>
        </x-buttons>
      </main>
    </x-accordion>
  </x-card>
);

export default connect(undefined, dispatch => ({ newProject: () => dispatch(newProject()) }))(Menu);
