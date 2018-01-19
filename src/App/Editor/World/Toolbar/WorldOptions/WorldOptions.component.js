// @flow
import React from 'react';

import { XNumberInput } from 'Framework/ReactXelToolkit';

import styles from './WorldOptions.style';

export type Gravity = { x?: number, y?: number }

export type Props = {
  tracking: boolean,
  gravity: Gravity,
  mouseForce: number,
  speed: number,
  pixelsPerMeter: number,
  updateGravity: (gravity: Gravity) => void,
  updateMouseForce: (force: number) => void,
  updateSpeed: (speed: number) => void,
  toggleTracking: () => void,
  setPixelsPerMeter: (event: CustomEvent, value: number) => void,
};

export default class WorldOptions extends React.Component<Props> {
  setGravityX = (event: CustomEvent, value: number) => this.props.updateGravity({ x: value })

  setGravityY = (event: CustomEvent, value: number) => this.props.updateGravity({ y: value })

  updateMouseForce = (event: CustomEvent, value: number) => this.props.updateMouseForce(value);

  updateSpeed = (event: CustomEvent, value: number) => this.props.updateSpeed(value);

  render() {
    const {
      gravity,
      tracking,
      mouseForce,
      speed,
      toggleTracking,
      pixelsPerMeter,
      setPixelsPerMeter,
    } = this.props;
    return (
      <x-box>
        <x-button style={styles.inputContainer}>
          <x-box vertical>
            <x-label>Scene Settings</x-label>
            <x-icon name="settings" />
          </x-box>
          <x-popover>
            <main>
              <x-box>
                <x-box vertical>
                  <x-label><strong>Ratio</strong></x-label>
                  <XNumberInput
                    value={pixelsPerMeter}
                    min={1}
                    suffix=" px/m"
                    onChange={setPixelsPerMeter}
                  >
                    <x-stepper disabled="decrement" />
                  </XNumberInput>
                </x-box>
                <x-box style={styles.inputContainer} vertical>
                  <x-label><strong>Speed</strong></x-label>
                  <XNumberInput
                    value={speed}
                    min={0}
                    step={0.1}
                    onChange={this.updateSpeed}
                    prefix="x "
                  >
                    <x-stepper disabled="decrement" />
                  </XNumberInput>
                </x-box>
                <x-box style={styles.inputContainer} vertical>
                  <x-label><strong>Release Force</strong></x-label>
                  <XNumberInput value={mouseForce} suffix=" N" onChange={this.updateMouseForce}>
                    <x-stepper />
                  </XNumberInput>
                </x-box>
                <x-box vertical>
                  <x-label style={{ marginLeft: '28px' }}><strong>Gravity</strong></x-label>
                  <x-box>
                    <x-box style={styles.inputContainer}>
                      <x-label>X:</x-label>
                      <XNumberInput style={styles.number} value={gravity.x} suffix=" m/s^2" onChange={this.setGravityX}>
                        <x-stepper />
                      </XNumberInput>
                    </x-box>
                    <x-box style={styles.inputContainer}>
                      <x-label>Y:</x-label>
                      <XNumberInput style={styles.number} value={gravity.y} suffix=" m/s^2" onChange={this.setGravityY}>
                        <x-stepper />
                      </XNumberInput>
                    </x-box>
                  </x-box>
                </x-box>
              </x-box>
            </main>
          </x-popover>
        </x-button>
        <x-box style={styles.inputContainer} vertical>
          <x-label><strong>Track</strong></x-label>
          <x-box style={styles.checkboxContainer}>
            <x-checkbox id="track" toggled={tracking || null} onClick={toggleTracking} />
            <x-label for="track">Body</x-label>
          </x-box>
        </x-box>
      </x-box>
    );
  }
}
