import React from 'react';

import { XButton } from 'Framework/ReactXelToolkit';
import { RouteLink } from 'Framework/ReactRouterHelpers';

import styles from './Wizard.style';

export default () => (
  <div style={styles.container}>
    <div style={styles.overlay} />
    <x-card style={styles.card}>
      <header>
        <h3><strong>Choose your scene</strong></h3>
      </header>
      <main>
        <x-box>
          <x-box>
            <RouteLink to="/editor/scene2d" selectedProp="toggled">
              <XButton>2D Scene</XButton>
            </RouteLink>
          </x-box>
          <x-box>
            <RouteLink to="/editor/scene3d" selectedProp="toggled">
              <XButton>3D Scene</XButton>
            </RouteLink>
          </x-box>
        </x-box>
      </main>
    </x-card>
  </div>
);
