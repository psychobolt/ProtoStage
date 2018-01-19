import Hashids from 'hashids';

import { defaultBody } from '../World/World.state';

const defaultLayer = {
  id: new Hashids('default_layer').encode(0),
  pathIds: [],
};

export default {
  paths: {},
  pathIds: [],
  pathLinks: {},
  selectedPathIds: [],
  layers: {
    [defaultLayer.id]: defaultLayer,
  },
  layerIds: [defaultLayer.id],
  layerLinks: {
    [defaultLayer.id]: {
      bodyId: defaultBody.id,
    },
  },
  activeLayer: defaultLayer.id,
  activeTool: 'select',
};
