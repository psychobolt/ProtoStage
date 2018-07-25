// @flow
import React from 'react';
import { defaultMemoize } from 'reselect';

import { XNumberInput } from 'Framework/ReactXelToolkit';

import styles from './Toolbar.style';

type Props = {
  layerIds: string[],
  activeLayer: string,
  gridSpacing: number,
  autoSync: boolean,
  addLayer: () => void,
  selectLayer: (id: string) => void,
  removeLayer: (id: string) => void,
  setGridSpacing: (value: number) => void,
  toggleAutoSync: () => void,
};

let clickHandlers = {};

const getMenuItems = defaultMemoize((ids, activeLayer, selectLayer) => {
  const eventHandlers = {};
  const menuItems = ids.map((id, index) => {
    eventHandlers[id] = clickHandlers[id] ? clickHandlers[id] : () => selectLayer(id);
    return (
      <x-menuitem key={`layer_${id}`} toggled={id === activeLayer} onClick={eventHandlers[id]}>
        <x-label>
          {`Layer ${index + 1}`}
        </x-label>
      </x-menuitem>
    );
  });
  clickHandlers = eventHandlers;
  return menuItems;
});

export default ({
  layerIds,
  addLayer,
  removeLayer,
  activeLayer,
  selectLayer,
  gridSpacing,
  setGridSpacing,
  autoSync,
  toggleAutoSync,
}: Props) => (
  <x-box style={styles.container} vertical>
    <x-box>
      <x-box style={styles.inputContainer} vertical>
        <x-label>
          <strong>
            {'Layers'}
          </strong>
        </x-label>
        <x-box>
          <x-select style={styles.select}>
            <x-menu>
              {getMenuItems(layerIds, activeLayer, selectLayer)}
            </x-menu>
          </x-select>
          <x-buttons tracking="-1">
            <x-button onClick={addLayer} style={styles.button}>
              <x-icon name="add-box" />
            </x-button>
            <x-button
              style={styles.button}
              onClick={() => { if (layerIds.length) removeLayer(activeLayer); }}
            >
              <x-icon name="delete" />
            </x-button>
          </x-buttons>
        </x-box>
      </x-box>
      <x-box style={styles.inputContainer} vertical>
        <x-label>
          <strong>
            {'Sync New Paths'}
          </strong>
        </x-label>
        <x-box style={styles.checkboxContainer}>
          <x-checkbox
            id="sync_new_paths"
            toggled={autoSync || null}
            onClick={toggleAutoSync}
          />
          <x-label for="sync_new_paths">
            {'On Scene'}
          </x-label>
        </x-box>
      </x-box>
    </x-box>
    <hr style={styles.divider} />
    <x-box>
      <x-box style={styles.inputContainer} vertical>
        <x-label>
          <strong>
            {'Grid Spacing'}
          </strong>
        </x-label>
        <XNumberInput
          value={gridSpacing}
          min={1}
          suffix=" px"
          onChange={(event: CustomEvent, value: number) => setGridSpacing(value)}
        >
          <x-stepper disabled="decrement" />
        </XNumberInput>
      </x-box>
    </x-box>
  </x-box>
);
