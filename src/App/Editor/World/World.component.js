// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { withStateHandlers, compose } from 'recompose';
import { defaultMemoize } from 'reselect';

import withResizableContainer from 'Framework/ReactResizableContainer';
import { getCanvas, getWorld } from 'App/App.selectors';

import Toolbar from './Toolbar';
import Wizard from './Wizard';
import Scene2D from './Scene2D';
import Scene3D from './Scene3D';
import { selectBody, updateBodies, removeBodies, updateFixtures, addJoint, removeJoints, updateJoints, addAnchor, removeAnchors, updateAnchors, setPixelsPerMeter, toggleTracking, updateGravity, updateMouseForce, updateSpeed } from './World.actions';
import styles from './World.styles';

type Props = {
  containerEl: HTMLDivElement,
  containerWidth: number,
  containerHeight: number,
  registerResizeListener: () => void
};

export const World = ({
  containerEl, containerWidth, containerHeight, registerResizeListener, ...rest
}: Props) => {
  const width = containerWidth;
  const height = containerHeight - 128;
  return (
    <div role="presentation" style={styles.container}>
      <Route exact path="/project/:id/:scene" render={() => <Toolbar {...rest} />} />
      <Switch>
        <Route exact path="/project/:id?" component={Wizard} />
        <Route path="/project/:id/scene2D" render={() => <Scene2D width={width} height={height} registerResizeListener={registerResizeListener} {...rest} />} />
        <Route path="/project/:id/scene3D" render={() => <Scene3D style={styles.scene} container={containerEl} width={width} height={height} {...rest} />} />
      </Switch>
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    state => {
      const world = getWorld(state);
      const { paths } = getCanvas(state);
      return { ...world, paths };
    },
    defaultMemoize(dispatch => ({
      selectBody: id => dispatch(selectBody(id)),
      updateBody: body => dispatch(updateBodies([body])),
      removeBody: id => dispatch(removeBodies([id])),
      updateFixture: fixture => dispatch(updateFixtures([fixture])),
      addJoint: payload => {
        const action = addJoint(payload);
        dispatch(action);
        return action.payload;
      },
      removeJoint: id => dispatch(removeJoints([id])),
      updateJoint: joint => dispatch(updateJoints([joint])),
      addAnchor: (jointId, anchor) => dispatch(addAnchor(jointId, anchor)),
      removeAnchor: (jointId, anchorId) => dispatch(removeAnchors(jointId, [anchorId])),
      updateAnchor: (jointId, anchor) => dispatch(updateAnchors(jointId, [anchor])),
      updateGravity: gravity => dispatch(updateGravity(gravity)),
      updateMouseForce: force => dispatch(updateMouseForce(force)),
      updateSpeed: speed => dispatch(updateSpeed(speed)),
      setPixelsPerMeter: (event, value) => dispatch(setPixelsPerMeter(value)),
      toggleTracking: () => dispatch(toggleTracking()),
    })),
  ),
  withStateHandlers(
    ({ bodies, activeBody, jointIds }) => ({
      activeFixture: bodies[activeBody].fixtureIds[0],
      activeJoint: jointIds[0],
    }),
    {
      setActiveFixture: () => (activeFixture: string) => ({ activeFixture }),
      setActiveJoint: () => (activeJoint: string) => ({ activeJoint }),
    },
  ),
  withResizableContainer,
)(World);
