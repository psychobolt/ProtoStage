import { getProject } from 'App/App.selectors';
import { Actions as WorldActions } from 'App/Editor/World/World.actions';
import { Actions as CanvasActions } from 'App/Editor/Canvas/Canvas.actions';

import { Actions as ProjectActions } from '../../Project.actions';
import initialState from './Canvas.state';

const getEntitiesByIds = (ids, entities) =>
  ids.reduce((rest, id) => ({ ...rest, [id]: entities[id] }), {});

const getChildren = (keys, entities, mapper) =>
  keys.reduce((rest, key) => rest.concat(mapper(entities[key])), []);

const getPaths = (state = initialState.paths, action) => {
  switch (action.type) {
    case CanvasActions.ADD_PATH: return { ...state, [action.payload.id]: action.payload };
    case CanvasActions.UPDATE_PATHS: return {
      ...state,
      ...action.payload.reduce((paths, path) => ({
        ...paths,
        [path.id]: { ...state[path.id], ...path },
      }), {}),
    };
    case CanvasActions.DESELECT_ALL: return Object.keys(state).reduce((rest, id) =>
      ({ ...rest, [id]: { ...state[id], selected: false } }), {});
    case CanvasActions.SELECT_PATHS: return {
      ...state,
      ...action.payload.ids.reduce((paths, id) =>
        ({ ...paths, [id]: { ...state[id], selected: true } }), {}),
    };
    default: return state;
  }
};

const getPathIds = (state = initialState.pathIds, action) => {
  switch (action.type) {
    case CanvasActions.ADD_PATH: return state.concat(action.payload.id);
    case CanvasActions.REMOVE_PATHS: return state.filter(id => !action.payload.ids.includes(id));
    default: return state;
  }
};

const getSelectedPathIds = (state = initialState.selectedPathIds, action) => {
  switch (action.type) {
    case CanvasActions.ADD_PATH:
      return action.payload.selected ? state.concat(action.payload.id) : state;
    case CanvasActions.SELECT_PATHS: return action.payload.ids;
    case CanvasActions.REMOVE_PATHS: return state.filter(id => !action.payload.ids.includes(id));
    case CanvasActions.DESELECT_ALL: return [];
    default: return state;
  }
};

const getLayers = (state = initialState.layers, action) => {
  switch (action.type) {
    case CanvasActions.ADD_LAYER: return { ...state, [action.payload.id]: action.payload };
    case CanvasActions.ADD_PATH: {
      const { id, layer } = action.payload;
      const { pathIds, ...rest } = state[layer];
      return {
        ...state,
        [layer]: {
          ...rest,
          pathIds: pathIds.concat(id),
        },
      };
    }
    case CanvasActions.REMOVE_PATHS: return Object.keys(state).reduce((layers, id) => {
      const { pathIds, ...layer } = state[id];
      return {
        ...layers,
        [id]: { ...layer, pathIds: pathIds.filter(pathId => !action.payload.ids.includes(pathId)) },
      };
    }, {});
    default: return state;
  }
};

const getLayerIds = (state = initialState.layerIds, action) => {
  switch (action.type) {
    case CanvasActions.ADD_LAYER: return state.concat(action.payload.id);
    case CanvasActions.REMOVE_LAYERS: return state.filter(id => !action.payload.ids.includes(id));
    default: return state;
  }
};

const getLayerLinks = (state = initialState.layerLinks, action) => {
  switch (action.type) {
    case CanvasActions.LINK_LAYER: return {
      ...state,
      [action.payload.id]: {
        ...state[action.payload.id],
        ...action.payload.links,
      },
    };
    case WorldActions.REMOVE_BODIES: return Object.keys(state).reduce((links, id) => {
      const link = state[id];
      return {
        ...links,
        [id]: link ? {
          ...link,
          bodyId: action.payload.ids.includes(id) ? null : link.bodyId,
        } : link,
      };
    }, {});
    default: return state;
  }
};

const getPathLinks = (state = initialState.pathLinks, action) => {
  switch (action.type) {
    case CanvasActions.LINK_PATH: {
      const { id, links } = action.payload;
      return { ...state, [id]: { ...state[id], ...links } };
    }
    default: return state;
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CanvasActions.ADD_PATH: {
      return {
        ...state,
        paths: getPaths(state.paths, action),
        pathIds: getPathIds(state.pathIds, action),
        selectedPathIds: getSelectedPathIds(state.selectedPathIds, action),
        layers: getLayers(state.layers, action),
      };
    }
    case CanvasActions.LINK_PATH:
      return { ...state, pathLinks: getPathLinks(state.pathLinks, action) };
    case CanvasActions.REMOVE_PATHS: {
      const pathIds = getPathIds(state.pathIds, action);
      return {
        ...state,
        pathIds,
        paths: getEntitiesByIds(pathIds, state.paths),
        pathLinks: getEntitiesByIds(pathIds, state.pathLinks),
        selectedPathIds: getSelectedPathIds(state.selectedPathIds, action),
        layers: getLayers(state.layers, action),
      };
    }
    case CanvasActions.UPDATE_PATHS: return {
      ...state,
      paths: getPaths(state.paths, action),
    };
    case CanvasActions.SELECT_PATHS: return {
      ...state,
      paths: getPaths(state.paths, action),
      selectedPathIds: getSelectedPathIds(state.selectedPathIds, action),
    };
    case CanvasActions.DESELECT_ALL: return {
      ...state,
      paths: {
        ...state.paths,
        ...getPaths(getEntitiesByIds(state.selectedPathIds, state.paths), action),
      },
      selectedPathIds: getSelectedPathIds(state.selectedPathIds, action),
    };
    case CanvasActions.ADD_LAYER: return {
      ...state,
      layers: getLayers(state.layers, action),
      layerIds: getLayerIds(state.layerIds, action),
    };
    case CanvasActions.REMOVE_LAYERS: {
      const layerIds = getLayerIds(state.layerIds, action);
      const pathIds = getChildren(layerIds, state.layers, layer => layer.pathIds);
      return {
        ...state,
        layers: getEntitiesByIds(layerIds, state.layers),
        layerLinks: getEntitiesByIds(layerIds, state.layerLinks),
        layerIds,
        activeLayer: !layerIds.includes(state.activeLayer) ? layerIds[0] : state.activeBody,
        pathIds,
        paths: getEntitiesByIds(pathIds, state.paths),
        pathLinks: getEntitiesByIds(pathIds, state.pathLinks),
        selectedPathIds: state.selectedPathIds.filter(id => pathIds.includes(id)),
      };
    }
    case WorldActions.REMOVE_BODIES: return { // TODO keep or remove?
      ...state,
      layerLinks: getLayerLinks(state.layerLinks, action),
    };
    case CanvasActions.LINK_LAYER:
      return { ...state, layerLinks: getLayerLinks(state.layerLinks, action) };
    case CanvasActions.SELECT_LAYER: return { ...state, activeLayer: action.payload.id };
    case CanvasActions.SELECT_TOOL: return { ...state, activeTool: action.payload.tool };
    case ProjectActions.LOAD_PROJECT:
      return { ...state, ...getProject({ app: action.payload }).canvas };
    default: return state;
  }
};
