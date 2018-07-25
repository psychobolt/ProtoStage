// @flow
import React from 'react';
import { defaultMemoize } from 'reselect';
import { JointTypes } from 'react-planck';

import { XSelect, XNumberInput } from 'Framework/ReactXelToolkit';

import type { Bodies, Fixtures, Paths, Anchor, JointProps } from '../../Scene2D';
import WheelOptions from './WheelOptions';
import styles from './JointOptions.style';

type Anchors = {
  [string]: Anchor
}

export type Props = {
  pixelsPerMeter: number,
  bodyIds: string[],
  bodies: Bodies,
  fixtures: Fixtures,
  paths: Paths,
  joint: JointProps,
  jointIds: string[],
  activeJoint: string,
  addJoint: (joint: JointProps) => JointProps,
  updateJoint: (joint: JointProps) => void,
  removeJoint: (id: string) => void,
  setActiveJoint: (id?: string) => void,
  addAnchor: (jointId: string, anchor: Anchor) => void,
  removeAnchor: (jointId: string, anchorId: string) => void,
  updateAnchor: (jointId: string, anchors: Anchor) => void,
}

type State = {
  activeFixture: string,
}

const NO_SELECTION = '0';

export default class JointOptions extends React.Component<Props, State> {
  state = {
    activeFixture: NO_SELECTION,
  }

  componentWillReceiveProps({ jointIds, activeJoint, setActiveJoint }: Props) {
    if (!activeJoint && jointIds.length) {
      setActiveJoint(jointIds[0]);
    }
  }

  getMenu = defaultMemoize((ids, activeJoint) => ids.map((id, index) => (
    <x-menuitem key={`joint_${id}`} value={id} toggled={activeJoint === id}>
      <x-label>
        {`Joint ${index + 1}`}
      </x-label>
    </x-menuitem>
  )))

  getBodyItems = defaultMemoize((ids, body) => ids.map((id, index) => (
    <x-menuitem key={`bodyA_${id}`} value={id} toggled={body === id}>
      <x-label>
        {`Body ${index + 1}`}
      </x-label>
    </x-menuitem>
  )));

  getFixtureItems = defaultMemoize((ids: string[], bodies: Bodies, activeFixture) => ids
    .reduce((items, id, i) => [
      ...items,
      ...bodies[id].fixtureIds.map((fixtureId, j) => (
        <x-menuitem key={`fixture_${fixtureId}`} value={fixtureId} toggled={fixtureId === activeFixture}>
          <x-label>
            {`Fixture ${j + 1} (Body ${i + 1})`}
          </x-label>
        </x-menuitem>
      )),
    ], []));

  getAnchors = defaultMemoize((anchors: Anchors) => Object.entries(anchors).map(([id, anchor]) => {
    const { updateAnchor, removeAnchor } = this.props;
    return (
      <x-box key={`anchor_${id}`} style={{ ...styles.inputContainer, ...styles.row }}>
        <x-box>
          <x-label>
            {'X:'}
          </x-label>
          <XNumberInput style={styles.number} value={anchor.x} suffix=" px/m" onChange={(event: CustomEvent, value: number) => updateAnchor(anchor.jointId, { ...anchor, x: value })}>
            <x-stepper />
          </XNumberInput>
        </x-box>
        <x-box style={styles.inputContainer}>
          <x-label>
            {'Y:'}
          </x-label>
          <XNumberInput style={styles.number} value={anchor.y} suffix=" px/m" onChange={(event: CustomEvent, value: number) => updateAnchor(anchor.jointId, { ...anchor, y: value })}>
            <x-stepper />
          </XNumberInput>
        </x-box>
        <x-button style={styles.button} onClick={() => removeAnchor(anchor.jointId, id)}>
          <x-icon name="delete" />
        </x-button>
      </x-box>
    );
  }))

  setMaxMotorTorque = (event: CustomEvent, value: number) => {
    const { joint, updateJoint } = this.props;
    updateJoint({ id: joint.id, maxMotorTorque: value });
  }

  setMotorSpeed = (event: CustomEvent, value: number) => {
    const { joint, updateJoint } = this.props;
    updateJoint({ id: joint.id, motorSpeed: value });
  }

  addRevolute = () => this.addJoint(JointTypes.REVOLUTE);

  addWheel = () => this.addJoint(JointTypes.WHEEL);

  addPrismatic = () => this.addJoint(JointTypes.PRISMATIC);

  addJoint = (type: string) => {
    const { bodyIds, addJoint, setActiveJoint } = this.props;
    const body = bodyIds[0];
    let options = { type, bodyA: body, bodyB: body };
    if (type === JointTypes.WHEEL) {
      options = {
        ...options,
        frequencyHz: 2,
        dampingRatio: 0,
      };
    }
    if (type === JointTypes.WHEEL || type === JointTypes.PRISMATIC) {
      options = { ...options, axis: { x: 0, y: 1 } };
    }
    const joint = addJoint(options);
    setActiveJoint(joint.id);
  }

  removeJoint = () => {
    const { jointIds, activeJoint, setActiveJoint, removeJoint } = this.props;
    setActiveJoint(jointIds.find(id => id !== activeJoint));
    removeJoint(activeJoint);
  }

  selectJoint = (event: CustomEvent) => {
    const { setActiveJoint } = this.props;
    setActiveJoint(event.detail.newValue);
  }

  selectBodyA = (event: CustomEvent) => {
    const { updateJoint, activeJoint } = this.props;
    updateJoint({ id: activeJoint, bodyA: event.detail.newValue });
  }

  selectBodyB = (event: CustomEvent) => {
    const { activeJoint, updateJoint } = this.props;
    updateJoint({ id: activeJoint, bodyB: event.detail.newValue });
  }

  selectFixture = (event: CustomEvent) => this.setState({ activeFixture: event.detail.newValue });

  toggleEnableMotor = () => {
    const { joint, updateJoint } = this.props;
    const { id, enableMotor } = joint;
    updateJoint({ id, enableMotor: !enableMotor });
  }

  addAnchor = () => {
    const { activeFixture } = this.state;
    let anchor = { x: 0, y: 0 };
    if (activeFixture !== NO_SELECTION) {
      const { fixtures, paths, pixelsPerMeter } = this.props;
      const fixture = fixtures[activeFixture];
      const { position } = paths[fixture.pathId].properties;
      if (position) {
        anchor = {
          x: position.x / pixelsPerMeter,
          y: -position.y / pixelsPerMeter,
        };
      }
    }
    const { activeJoint, addAnchor } = this.props;
    addAnchor(activeJoint, anchor);
  }

  render() {
    const { bodyIds, bodies, joint, jointIds, activeJoint, updateJoint } = this.props;
    const { activeFixture } = this.state;
    return (
      <x-box style={styles.inputContainer} vertical>
        <x-label>
          <strong>
            {'Joints'}
          </strong>
        </x-label>
        <x-box>
          {jointIds.length ? (
            <XSelect style={styles.select} onChange={this.selectJoint}>
              <x-menu>
                {this.getMenu(jointIds, activeJoint)}
              </x-menu>
            </XSelect>
          ) : null}
          <x-buttons>
            <x-button style={styles.button}>
              <x-icon name="add-box" />
              <x-menu>
                <x-menuitem onClick={this.addRevolute}>
                  <x-label>
                    {'Revolute'}
                  </x-label>
                </x-menuitem>
                <x-menuitem onClick={this.addWheel}>
                  <x-label>
                    {'Wheel'}
                  </x-label>
                </x-menuitem>
                <x-menuitem onClick={this.addPrismatic}>
                  <x-label>
                    {'Prismatic'}
                  </x-label>
                </x-menuitem>
              </x-menu>
            </x-button>
            {joint && (
              <x-button style={styles.button}>
                <x-icon name="settings" />
                <x-popover>
                  <main>
                    <x-box style={styles.row} vertical>
                      <x-label>
                        <strong>
                          {'Body A'}
                        </strong>
                      </x-label>
                      <XSelect style={styles.select} onChange={this.selectBodyA}>
                        <x-menu>
                          {this.getBodyItems(bodyIds, joint.bodyA)}
                        </x-menu>
                      </XSelect>
                    </x-box>
                    <x-box style={styles.row} vertical>
                      <x-label>
                        <strong>
                          {'Body B'}
                        </strong>
                      </x-label>
                      <XSelect style={styles.select} onChange={this.selectBodyB}>
                        <x-menu>
                          {this.getBodyItems(bodyIds, joint.bodyB)}
                        </x-menu>
                      </XSelect>
                    </x-box>
                    <x-box style={styles.row} vertical>
                      <x-label>
                        {'<strong>Anchors</strong>'}
                      </x-label>
                      <x-box>
                        <XSelect style={styles.select} onChange={this.selectFixture}>
                          <x-menu>
                            <x-menuitem
                              toggled={activeFixture === NO_SELECTION}
                              value={NO_SELECTION}
                            >
                              <x-label>
                                {'Custom'}
                              </x-label>
                            </x-menuitem>
                            {this.getFixtureItems(bodyIds, bodies, activeFixture)}
                          </x-menu>
                        </XSelect>
                        <x-button style={styles.button} onClick={this.addAnchor}>
                          <x-icon name="add-box" />
                        </x-button>
                      </x-box>
                    </x-box>
                    {this.getAnchors(joint.anchors)}
                    <x-box style={styles.row} vertical>
                      <x-label>
                        {'<strong>Motor</strong>'}
                      </x-label>
                      <x-box style={styles.checkboxContainer}>
                        <x-checkbox id="enable_motor" toggled={joint.enableMotor || null} onClick={this.toggleEnableMotor} />
                        <x-label for="enable_motor">
                          {'Enabled'}
                        </x-label>
                      </x-box>
                    </x-box>
                    <x-box style={styles.row} vertical>
                      <x-label>
                        {'<strong>Motor Speed</strong>'}
                      </x-label>
                      <XNumberInput
                        value={joint.motorSpeed}
                        suffix=" m/s"
                        onChange={this.setMotorSpeed}
                      >
                        <x-stepper disabled="decrement" />
                      </XNumberInput>
                    </x-box>
                    <x-box style={styles.row} vertical>
                      <x-label>
                        {'<strong>Max Motor Torque</strong>'}
                      </x-label>
                      <XNumberInput
                        value={joint.maxMotorTorque}
                        min={0}
                        suffix=" N"
                        onChange={this.setMaxMotorTorque}
                      >
                        <x-stepper disabled="decrement" />
                      </XNumberInput>
                    </x-box>
                    {joint.type === JointTypes.WHEEL && (
                      <WheelOptions joint={joint} updateJoint={updateJoint} />
                    )}
                  </main>
                </x-popover>
              </x-button>
            )}
            {joint && (
              <x-button style={styles.button} onClick={this.removeJoint}>
                <x-icon name="delete" />
              </x-button>
            )}
          </x-buttons>
        </x-box>
      </x-box>
    );
  }
}
