// @flow
import { initialLayerId } from './Canvas.actions';

type Path = {
  id: number,
  type: string,
  pathData: string,
  layer: number,
};

export type Layer = {
  id: number,
  pathIds: number[]
};

export type Canvas = {
  paths: {
    [number]: Path
  },
  pathIds: number[],
  selectedPathIds: number[],
  layers: {
    [number]: Layer,
  },
  layerIds: number[],
  activeLayer: number,
};

const initialLayer = {
  id: initialLayerId,
  pathIds: [],
};

export default {
  paths: {},
  pathIds: [],
  selectedPathIds: [],
  activeTool: 'select',
  layers: {
    [initialLayer.id]: initialLayer,
  },
  layerIds: [initialLayer.id],
  activeLayer: initialLayer.id,
};
