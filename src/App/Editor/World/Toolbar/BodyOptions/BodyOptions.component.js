// @flow
import React from 'react';
import { defaultMemoize } from 'reselect';
import { Body } from 'planck-js';

import { XNumberInput } from 'Framework/ReactXelToolkit';

import type { Bodies, BodyProps } from '../../Scene2D';
import styles from './BodyOptions.style';

export type Props = {
  bodyIds: string[],
  bodies: Bodies,
  activeBody: string,
  selectBody: (id: string) => void,
  updateBody: (body: BodyProps) => void,
  removeBody: (id: string) => void,
}

export default class BodyOptions extends React.Component<Props> {
  bodyHandlers: {
    [string]: (id: string) => void
  } = {};

  getMenuItems = defaultMemoize((ids, activeBody, _selectBody) => {
    const eventHandlers = {};
    const menuItems = ids.map((id, index) => {
      eventHandlers[id] = this.bodyHandlers[id] ? this.bodyHandlers[id] : () => _selectBody(id);
      return (
        <x-menuitem key={`body_${id}`} toggled={id === activeBody} onClick={eventHandlers[id]}>
          <x-label>
            {`Body ${index + 1}`}
          </x-label>
        </x-menuitem>
      );
    });
    this.bodyHandlers = eventHandlers;
    return menuItems;
  });

  setBodyStatic = () => {
    const { activeBody, updateBody } = this.props;
    updateBody({
      id: activeBody,
      type: Body.STATIC,
      linearVelocity: { x: 0, y: 0 },
      bullet: false,
    });
  }

  setBodyDynamic = () => {
    const { activeBody, updateBody } = this.props;
    updateBody({ id: activeBody, type: Body.DYNAMIC });
  }

  setLinearVelocityX = (event: CustomEvent, value: number) => {
    const { activeBody, bodies, updateBody } = this.props;
    const body = bodies[activeBody];
    updateBody({
      id: activeBody,
      linearVelocity: { ...body.linearVelocity, x: value },
    });
  }

  setLinearVelocityY = (event: CustomEvent, value: number) => {
    const { activeBody, bodies, updateBody } = this.props;
    const body = bodies[activeBody];
    updateBody({
      id: activeBody,
      linearVelocity: { ...body.linearVelocity, y: value },
    });
  }

  setLinearDamping = (event: CustomEvent, value: number) => {
    const { activeBody, updateBody } = this.props;
    updateBody({ id: activeBody, linearDamping: value });
  }

  setAngularDamping = (event: CustomEvent, value: number) => {
    const { activeBody, updateBody } = this.props;
    updateBody({ id: activeBody, angularDamping: value });
  }

  removeBody = () => {
    const { bodyIds, activeBody, removeBody } = this.props;
    if (bodyIds.length) removeBody(activeBody);
  }

  toggleBullet = () => {
    const { activeBody, updateBody, bodies } = this.props;
    const body = bodies[activeBody];
    updateBody({ id: activeBody, bullet: !body.bullet });
  }

  render() {
    const { bodyIds, bodies, activeBody, selectBody } = this.props;
    const currentBody = bodies[activeBody];
    return (
      <React.Fragment>
        <x-box style={styles.inputContainer} vertical>
          <x-label>
            <strong>
              {'Bodies'}
            </strong>
          </x-label>
          <x-box>
            <x-select style={styles.select}>
              <x-menu>
                {this.getMenuItems(bodyIds, activeBody, selectBody)}
              </x-menu>
            </x-select>
            <x-buttons>
              <x-button style={styles.button}>
                <x-icon name="settings" />
                <x-popover>
                  <main>
                    <x-box vertical>
                      <x-box vertical>
                        <x-label>
                          <strong>
                            {'Type'}
                          </strong>
                        </x-label>
                        <x-select>
                          <x-menu>
                            <x-menuitem value="static" toggled={currentBody.type === Body.STATIC} onClick={this.setBodyStatic}>
                              <x-label>
                                {'Static'}
                              </x-label>
                            </x-menuitem>
                            <x-menuitem value="dynamic" toggled={currentBody.type === Body.DYNAMIC} onClick={this.setBodyDynamic}>
                              <x-label>
                                {'Dynamic'}
                              </x-label>
                            </x-menuitem>
                          </x-menu>
                        </x-select>
                      </x-box>
                      {currentBody.type === Body.DYNAMIC && (
                        <React.Fragment>
                          <x-box style={styles.row} vertical>
                            <x-label>
                              <strong>
                                {'Linear Velocity'}
                              </strong>
                            </x-label>
                            <x-box>
                              <x-box>
                                <x-label>
                                  {'X:'}
                                </x-label>
                                <XNumberInput style={styles.number} value={currentBody.linearVelocity.x} suffix=" m/s" onChange={this.setLinearVelocityX}>
                                  <x-stepper />
                                </XNumberInput>
                              </x-box>
                              <x-box style={styles.inputContainer}>
                                <x-label>
                                  {'Y:'}
                                </x-label>
                                <XNumberInput style={styles.number} value={currentBody.linearVelocity.y} suffix=" m/s" onChange={this.setLinearVelocityY}>
                                  <x-stepper />
                                </XNumberInput>
                              </x-box>
                            </x-box>
                          </x-box>
                          <x-box style={styles.row} vertical>
                            <x-label>
                              <strong>
                                {'Linear Damping'}
                              </strong>
                            </x-label>
                            <XNumberInput
                              value={currentBody.linearDamping}
                              onChange={this.setLinearDamping}
                            >
                              <x-stepper />
                            </XNumberInput>
                          </x-box>
                          <x-box style={styles.row} vertical>
                            <x-label>
                              <strong>
                                {'Angular Damping'}
                              </strong>
                            </x-label>
                            <XNumberInput
                              value={currentBody.angularDamping}
                              onChange={this.setAngularDamping}
                            >
                              <x-stepper />
                            </XNumberInput>
                          </x-box>
                          <x-box style={styles.row} vertical>
                            <x-label>
                              <strong>
                                {'Bullet'}
                              </strong>
                            </x-label>
                            <x-box style={styles.checkboxContainer}>
                              <x-checkbox id="bullet" onClick={this.toggleBullet} checked={currentBody.bullet || null} />
                              <x-label for="bullet">
                                {'Enabled'}
                              </x-label>
                            </x-box>
                          </x-box>
                        </React.Fragment>
                      )}
                    </x-box>
                  </main>
                </x-popover>
              </x-button>
              <x-button
                style={styles.button}
                onClick={this.removeBody}
              >
                <x-icon name="delete" />
              </x-button>
            </x-buttons>
          </x-box>
        </x-box>
      </React.Fragment>
    );
  }
}
