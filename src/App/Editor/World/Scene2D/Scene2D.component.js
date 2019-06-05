// @flow
import React from 'react';
import { PlanckContainer, Body, Fixture, Edge, Circle, Box, Polygon, Joint } from 'react-planck';
import { defaultMemoize } from 'reselect';
import { Vec2, type Body as PlBody } from 'planck-js';

import { type PathProps, CIRCLE_SHAPE, LINE_SHAPE, RECT_SHAPE } from '../../Canvas';

const ACTIVE_FIXTURE_STYLE = { stroke: 'yellow' };
const ACTIVE_BODY_STYLE = { stroke: 'rgba(255,255,255,0.9)' };
const INACTIVE_BODY_STYLE = { stroke: 'rgba(255,255,255,0.5)' };

export type FixtureProps = {
  id: string,
  bodyId: string,
  pathId: string
}

export type BodyProps = {
  id: string,
  fixtureIds: string[],
  type: string,
  linearVelocity: { x: number, y: number }
};

export type Bodies = {
  [string]: BodyProps
}

export type Fixtures = {
  [string]: FixtureProps
}

export type Paths = {
  [string]: PathProps
}

export type Anchor = {
  x: number,
  y: number,
}

export type JointProps = {
  id: string,
  type: string,
  axis?: { x: number, y: number },
  anchors: {
    [string]: Anchor
  }
}

type Props = {
  id: string,
  width: number,
  height: number,
  bodies: Bodies,
  bodyIds: string[],
  activeBody: string,
  fixtures: Fixtures,
  activeFixture: string,
  paths: Paths,
  joints: {
    [string]: JointProps
  },
  jointIds: string[],
  gravity: { x: number, y: number },
  pixelsPerMeter: number,
  mouseForce: number,
  speed: number,
  tracking: boolean,
  paused: boolean,
  registerResizeListener: () => void
};

export default class Scene2D extends React.Component<Props> {
  activeBody: PlBody

  pause: () => void

  resume: () => void

  isPaused: () => boolean

  componentDidMount() {
    const { registerResizeListener } = this.props;
    registerResizeListener();
  }

  componentDidUpdate({ id: oldId }: Props) {
    const { id, paused } = this.props;
    if (id === oldId) {
      const isPaused = this.isPaused();
      if (paused !== isPaused) {
        if (paused) {
          this.pause();
        } else {
          this.resume();
        }
      }
    }
  }

  onStep = (testbed: any) => () => {
    const { tracking } = this.props;
    if (tracking) {
      if (this.activeBody) {
        const position = this.activeBody.getPosition();
        let { x, y } = testbed;
        if (position.x > x + 10) x = position.x - 10;
        else if (position.x < x - 10) x = position.x + 10;
        if (position.y > y + 10) y = -position.y - 10;
        else if (position.y < y - 10) y = -position.y + 10;
        Object.assign(testbed, { x, y });
      }
    }
  }

  setActiveBody = (ref: PlBody) => { this.activeBody = ref; }

  getBodies = defaultMemoize((
    ids,
    bodies,
    activeBody,
    fixtures,
    activeFixture,
    paths,
    pixelsPerMeter,
  ) => ids.map(id => {
    const { type, fixtureIds, linearVelocity, ...body } = bodies[id];
    return (
      <Body
        id={id}
        key={id}
        type={type}
        {...body}
        linearVelocity={new Vec2(linearVelocity.x, linearVelocity.y)}
        ref={id === activeBody ? this.setActiveBody : null}
      >
        {fixtureIds.map(fixtureId => {
          const { pathId, bodyId, ...fixture } = fixtures[fixtureId];
          const { type: shape, closed, properties } = paths[pathId] || {};
          let render = {};
          if (fixtureId === activeFixture) {
            render = ACTIVE_FIXTURE_STYLE;
          } else if (bodyId === activeBody) {
            render = ACTIVE_BODY_STYLE;
          } else {
            render = INACTIVE_BODY_STYLE;
          }
          return properties && (
            <Fixture {...fixture} key={fixtureId} render={render}>
              {shape === LINE_SHAPE && (
                <Edge
                  v1={new Vec2(
                    properties.from.x / pixelsPerMeter,
                    -properties.from.y / pixelsPerMeter,
                  )}
                  v2={
                    new Vec2(properties.to.x / pixelsPerMeter, -properties.to.y / pixelsPerMeter)
                  }
                />
              )}
              {shape === CIRCLE_SHAPE && (
                <Circle
                  center={new Vec2(
                    properties.position.x / pixelsPerMeter,
                    -properties.position.y / pixelsPerMeter,
                  )}
                  radius={properties.radius / pixelsPerMeter}
                />
              )}
              {shape === RECT_SHAPE && (
                <Box
                  center={new Vec2(
                    properties.position.x / pixelsPerMeter,
                    -properties.position.y / pixelsPerMeter,
                  )}
                  hx={properties.width / 2 / pixelsPerMeter}
                  hy={properties.height / 2 / pixelsPerMeter}
                />
              )}
              {shape === 'Path' && closed && (
                <Polygon vertices={properties.points
                  .map(point => new Vec2(point.x / pixelsPerMeter, -point.y / pixelsPerMeter))}
                />
              )}
            </Fixture>
          );
        })}
      </Body>
    );
  }))

  getJoints = defaultMemoize((ids, joints) => ids.map(id => {
    let { axis, anchors, ...joint } = joints[id];
    if (axis) axis = new Vec2(axis.x, axis.y);
    if (anchors) anchors = Object.values(anchors).map(anchor => new Vec2(anchor.x, anchor.y));
    joint = { ...joint, axis, anchors };
    return <Joint key={id} {...joint} />;
  }))

  getViewProps = defaultMemoize((width, height, mouseForce, speed) => testbed => {
    this.pause = () => testbed.pause();
    this.resume = () => testbed.resume();
    this.isPaused = () => testbed.isPaused();
    return {
      width: `${width}px`,
      height: `${height}px`,
      x: 0,
      y: 0,
      mouseForce,
      speed,
      step: this.onStep(testbed),
    };
  })

  render() {
    const {
      id,
      width,
      height,
      bodies,
      bodyIds,
      activeBody,
      fixtures,
      activeFixture,
      paths,
      jointIds,
      joints,
      gravity,
      pixelsPerMeter,
      mouseForce,
      speed,
    } = this.props;
    return (
      <PlanckContainer
        key={id}
        worldProps={{ gravity: new Vec2({ x: gravity.x, y: gravity.y }) }}
        viewProps={this.getViewProps(width, height, mouseForce, speed)}
      >
        {this.getBodies(
          bodyIds,
          bodies,
          activeBody,
          fixtures,
          activeFixture,
          paths,
          pixelsPerMeter,
        )}
        {this.getJoints(jointIds, joints)}
      </PlanckContainer>
    );
  }
}
