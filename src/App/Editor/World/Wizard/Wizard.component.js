// @flow
import React from 'react';
import { connect, type Connector } from 'react-redux';

import { getProject } from 'App/App.selectors';
import { XButton } from 'Framework/ReactXelToolkit';
import { RouteLink } from 'Framework/ReactRouterHelpers';

import styles from './Wizard.style';

type Props = {
  projectId: string,
}

const Wizard = ({ projectId }: Props) => (
  <div style={styles.container}>
    <div style={styles.overlay} />
    <x-card style={styles.card}>
      <header>
        <h3>
          <strong>
            {'Choose your scene'}
          </strong>
        </h3>
      </header>
      <main>
        <x-box>
          <x-box>
            <RouteLink to={`/project/${projectId}/scene2d`} selectedProp="toggled">
              {({ onClick }) => (
                <XButton onClick={onClick}>
                  {'2D Scene'}
                </XButton>
              )}
            </RouteLink>
          </x-box>
          <x-box>
            <RouteLink to={`project/${projectId}/scene3d`} selectedProp="toggled">
              {({ onClick }) => (
                <XButton onClick={onClick}>
                  {'3D Scene'}
                </XButton>
              )}
            </RouteLink>
          </x-box>
        </x-box>
      </main>
    </x-card>
  </div>
);

const connector: Connector<Props, {}> = connect(state => ({ projectId: getProject(state).id }),
  () => ({}));

export default connector(Wizard);
