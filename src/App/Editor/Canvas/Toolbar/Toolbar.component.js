// @flow
import React from 'react';
import { defaultMemoize } from 'reselect';

import styles from './Toolbar.style';

type Props = {
  layerIds: number[],
  activeLayer: number,
  addLayer: () => void,
  selectLayer: (id: number) => void,
  removeLayer: (id: number) => void
};

let clickHandlers = {};

const getMenuItems = defaultMemoize((ids, activeLayer, selectLayer) => {
  const eventHandlers = {};
  const menuItems = ids.map((id, index) => {
    eventHandlers[id] = clickHandlers[id] ? clickHandlers[id] : () => selectLayer(id);
    return (
      <x-menuitem key={`layer_${id}`} selected={id === activeLayer} onClick={eventHandlers[id]}>
        <x-label>Layer {index + 1}</x-label>
      </x-menuitem>
    );
  });
  clickHandlers = eventHandlers;
  return menuItems;
});

export default ({ layerIds, addLayer, removeLayer, activeLayer, selectLayer }: Props) => (
  <x-box>
    <x-select style={styles.select}>
      <x-menu>{getMenuItems(layerIds, activeLayer, selectLayer)}</x-menu>
    </x-select>
    <x-buttons tracking="-1">
      <x-button onClick={addLayer} style={styles.button}><x-icon name="add-box" /></x-button>
      <x-button
        style={styles.button}
        onClick={() => { if (layerIds.length > 1) removeLayer(activeLayer); }}
      >
        <x-icon name="delete" />
      </x-button>
    </x-buttons>
  </x-box>
);
