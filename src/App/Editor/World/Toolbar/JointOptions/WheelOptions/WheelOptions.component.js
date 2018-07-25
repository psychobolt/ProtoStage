// @flow
import React from 'react';

import { XNumberInput } from 'Framework/ReactXelToolkit';

import { JointProps } from '../../../Scene2D';
import styles from './WheelOptions.style';

type Props = {
  joint: JointProps,
  updateJoint: (joint: JointProps) => void
}

export default class WheelOptions extends React.Component<Props> {
  setFrequency = (event: CustomEvent, value: number) => {
    const { joint, updateJoint } = this.props;
    updateJoint({ id: joint.id, frequencyHz: value });
  }

  setDampingRatio = (event: CustomEvent, value: number) => {
    const { joint, updateJoint } = this.props;
    updateJoint({ id: joint.id, dampingRatio: value });
  }

  render() {
    const { joint } = this.props;
    return (
      <React.Fragment>
        <x-box style={styles.inputContainer} vertical>
          <x-label>
            <strong>
              {'Frequency'}
            </strong>
          </x-label>
          <XNumberInput
            value={joint.frequencyHz}
            min={2}
            suffix=" Hz"
            onChange={this.setFrequency}
          >
            <x-stepper disabled="decrement" />
          </XNumberInput>
        </x-box>
        <x-box style={styles.inputContainer} vertical>
          <x-label>
            <strong>
              {'Damping Ratio'}
            </strong>
          </x-label>
          <XNumberInput
            value={joint.dampingRatio}
            min={0}
            onChange={this.setDampingRatio}
            step={0.1}
          >
            <x-stepper disabled="decrement" />
          </XNumberInput>
        </x-box>
      </React.Fragment>
    );
  }
}
