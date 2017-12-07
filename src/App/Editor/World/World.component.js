// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import withResizableContainer from 'Framework/ReactResizableContainer';
import Wizard from './Wizard';
import Scene3D from './Scene3D';
import styles from './World.styles';

type Props = {
  containerEl: HTMLDivElement,
  containerWidth: number,
  containerHeight: number,
};

export const World =
({ containerEl, containerWidth, containerHeight }: Props) => (
  <Switch>
    <Route exact path="/editor" component={Wizard} />
    <Route path="/editor/scene3D" render={() => <Scene3D style={styles.container} container={containerEl} width={containerWidth} height={containerHeight} />} />
  </Switch>
);

export default withResizableContainer(World);
