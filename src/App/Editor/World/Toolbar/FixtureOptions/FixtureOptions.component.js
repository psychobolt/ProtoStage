// @flow
import React from 'react';
import { defaultMemoize } from 'reselect';

import { XNumberInput, XSelect } from 'Framework/ReactXelToolkit';

import type { BodyProps, Fixtures, FixtureProps } from '../../Scene2D';
import styles from './FixtureOptions.style';

export type Props = {
  body: BodyProps,
  fixtures: Fixtures,
  activeFixture: string,
  setActiveFixture: (id: string) => void,
  updateFixture: (fixture: FixtureProps) => void,
}

export default class FixtureOptions extends React.Component<Props> {
  componentWillReceiveProps({ activeFixture, body, setActiveFixture }: Props) {
    const { fixtureIds } = body;
    if (fixtureIds.length
      && (!activeFixture || !fixtureIds.includes(activeFixture))) {
      setActiveFixture(fixtureIds[0]);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    if (!nextProps.activeFixture) return false;
    return true;
  }

  getMenu = defaultMemoize((ids, activeFixture) => ids.map((id, index) => (
    <x-menuitem key={`fixture_${id}`} value={id} toggled={activeFixture === id}>
      <x-label>
        {`Fixture ${index + 1}`}
      </x-label>
    </x-menuitem>
  )))

  setDensity = (event: CustomEvent, value: number) => {
    const { activeFixture, updateFixture } = this.props;
    updateFixture({ id: activeFixture, density: value });
  }

  setFriction = (event: CustomEvent, value: number) => {
    const { activeFixture, updateFixture } = this.props;
    updateFixture({ id: activeFixture, friction: value });
  }

  setRestitution = (event: CustomEvent, value: number) => {
    const { activeFixture, updateFixture } = this.props;
    updateFixture({ id: activeFixture, restitution: value });
  }

  selectFixture = (event: CustomEvent) => {
    const { setActiveFixture } = this.props;
    setActiveFixture(event.detail.newValue);
  }

  render() {
    const { body, fixtures, activeFixture } = this.props;
    const { fixtureIds } = body;
    const fixture = fixtures[activeFixture];
    return fixture ? (
      <x-box style={styles.inputContainer} vertical>
        <x-label>
          <strong>
            {'Fixtures'}
          </strong>
        </x-label>
        <x-box>
          <XSelect key={`body_${body.id}_fixtures`} style={styles.select} onChange={this.selectFixture}>
            <x-menu>
              {this.getMenu(fixtureIds, activeFixture)}
            </x-menu>
          </XSelect>
          <x-buttons>
            <x-button style={styles.button}>
              <x-icon name="settings" />
              <x-popover>
                <main>
                  <x-box>
                    <x-box vertical>
                      <x-label>
                        <strong>
                          {'Density'}
                        </strong>
                      </x-label>
                      <XNumberInput
                        value={fixture.density || 0}
                        min={0}
                        suffix=" kg/m^3"
                        onChange={this.setDensity}
                      >
                        <x-stepper disabled="decrement" />
                      </XNumberInput>
                    </x-box>
                    <x-box style={styles.inputContainer} vertical>
                      <x-label>
                        <strong>
                          {'Friction'}
                        </strong>
                      </x-label>
                      <XNumberInput
                        value={fixture.friction || 0}
                        min={0}
                        suffix=" N"
                        onChange={this.setFriction}
                      >
                        <x-stepper disabled="decrement" />
                      </XNumberInput>
                    </x-box>
                    <x-box style={styles.inputContainer} vertical>
                      <x-label>
                        <strong>
                          {'Restitution'}
                        </strong>
                      </x-label>
                      <XNumberInput
                        value={fixture.restitution || 0}
                        min={0}
                        step={0.1}
                        onChange={this.setRestitution}
                      >
                        <x-stepper disabled="decrement" />
                      </XNumberInput>
                    </x-box>
                  </x-box>
                </main>
              </x-popover>
            </x-button>
            <x-button style={styles.button}>
              <x-icon name="delete" />
            </x-button>
          </x-buttons>
        </x-box>
      </x-box>
    ) : null;
  }
}
