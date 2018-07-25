import { getProject } from 'App/App.selectors';
import { Actions as WorldActions } from 'App/Editor/World/World.actions';

import { Actions as ProjectActions } from '../../Project.actions';
import initialState from './World.state';

const getEntitiesByIds = (keys, entities) => keys
  .reduce((rest, key) => ({ ...rest, [key]: entities[key] }), {});

const getChildren = (keys, entities, mapper) => keys
  .reduce((rest, key) => rest.concat(mapper(entities[key])), []);

const getFixtures = (state = initialState.fixtures, action) => {
  switch (action.type) {
    case WorldActions.ADD_FIXTURES:
      return action.payload.fixtures
        .reduce((rest, fixture) => ({ ...rest, [fixture.id]: fixture }), state);
    case WorldActions.UPDATE_FIXTURES:
      return action.payload
        .reduce((rest, fixture) => ({
          ...rest, [fixture.id]: { ...state[fixture.id], ...fixture },
        }), state);
    default: return state;
  }
};

const getFixtureIds = (state = initialState.fixtureIds, action) => {
  switch (action.type) {
    case WorldActions.ADD_FIXTURES:
      return state.concat(action.payload.fixtures.map(fixture => fixture.id));
    case WorldActions.REMOVE_FIXTURES: return state.filter(id => !action.payload.ids.includes(id));
    default: return state;
  }
};

const getBodies = (state = initialState.bodies, action) => {
  switch (action.type) {
    case WorldActions.ADD_BODY: return { ...state, [action.payload.id]: action.payload };
    case WorldActions.UPDATE_BODIES: return action.payload.reduce((bodies, body) => ({
      ...bodies, [body.id]: { ...bodies[body.id], ...body },
    }), state);
    case WorldActions.ADD_FIXTURES: return {
      ...state,
      ...action.payload.fixtures.reduce((rest, fixture) => ({
        ...rest,
        [fixture.bodyId]: {
          ...state[fixture.bodyId],
          fixtureIds: state[fixture.bodyId].fixtureIds.concat(fixture.id),
        },
      }), {}),
    };
    case WorldActions.REMOVE_FIXTURES: {
      return Object.entries(state).reduce((bodies, [id, body]) => ({
        ...bodies,
        [id]: { ...body, fixtureIds: getFixtureIds(body.fixtureIds, action) },
      }), {});
    }
    default: return state;
  }
};

const getBodyIds = (state = initialState.bodyIds, action) => {
  switch (action.type) {
    case WorldActions.ADD_BODY: return state.concat(action.payload.id);
    case WorldActions.REMOVE_BODIES: return state.filter(id => !action.payload.ids.includes(id));
    default: return state;
  }
};

const getAnchors = (state = {}, action) => {
  switch (action.type) {
    case WorldActions.ADD_ANCHOR: return { ...state, [action.payload.id]: action.payload };
    case WorldActions.REMOVE_ANCHORS:
      return Object.entries(state)
        .reduce((anchors, [id, anchor]) => (action.payload.anchorIds
          .includes(id) ? anchors : { ...anchors, anchor }), {});
    case WorldActions.UPDATE_ANCHORS:
      return action.payload.anchors
        .reduce((anchors, anchor) => (
          { ...anchors, [anchor.id]: { ...state[anchor.id], ...anchor } }
        ), state);
    default: return state;
  }
};

const getJoints = (state = initialState.joints, action) => {
  switch (action.type) {
    case WorldActions.ADD_JOINT: return { ...state, [action.payload.id]: action.payload };
    // case WorldActions.REMOVE_BODIES:
    case WorldActions.UPDATE_JOINTS: return action.payload.reduce((joints, joint) => ({
      ...state, [joint.id]: { ...state[joint.id], ...joint },
    }), state);
    case WorldActions.ADD_ANCHOR:
    case WorldActions.REMOVE_ANCHORS:
    case WorldActions.UPDATE_ANCHORS: {
      const joint = state[action.payload.jointId];
      return {
        ...state,
        [joint.id]: { ...joint, anchors: getAnchors(joint.anchors, action) },
      };
    }
    default: return state;
  }
};

const getJointIds = (state = initialState.joint, action) => {
  switch (action.type) {
    case WorldActions.ADD_JOINT: return state.concat(action.payload.id);
    case WorldActions.REMOVE_JOINTS: return state.filter(id => !action.payload.ids.includes(id));
    default: return state;
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WorldActions.ADD_BODY: return {
      ...state,
      bodies: getBodies(state.bodies, action),
      bodyIds: getBodyIds(state.bodyIds, action),
    };
    case WorldActions.REMOVE_BODIES: {
      const bodyIds = getBodyIds(state.bodyIds, action);
      const fixtureIds = getChildren(bodyIds, state.bodies, body => body.fixtureIds);
      return {
        ...state,
        bodies: getEntitiesByIds(bodyIds, state.bodies),
        bodyIds,
        activeBody: !bodyIds.includes(state.activeBody) ? bodyIds[0] : state.activeBody,
        fixtures: getEntitiesByIds(fixtureIds, state.fixtures),
        fixtureIds,
        joints: getJoints(state.joints, action),
      };
    }
    case WorldActions.UPDATE_BODIES: return { ...state, bodies: getBodies(state.bodies, action) };
    case WorldActions.ADD_FIXTURES: return {
      ...state,
      bodies: getBodies(state.bodies, action),
      fixtures: getFixtures(state.fixtures, action),
      fixtureIds: getFixtureIds(state.fixtureIds, action),
    };
    case WorldActions.REMOVE_FIXTURES: {
      const fixtureIds = getFixtureIds(state.fixtureIds, action);
      return {
        ...state,
        bodies: getBodies(state.bodies, action),
        fixtures: getEntitiesByIds(fixtureIds, state.fixtures),
        fixtureIds,
      };
    }
    case WorldActions.UPDATE_FIXTURES:
      return { ...state, fixtures: getFixtures(state.fixtures, action) };
    case WorldActions.SELECT_BODY: return { ...state, activeBody: action.payload.id };
    case WorldActions.ADD_JOINT: return {
      ...state,
      joints: getJoints(state.joints, action),
      jointIds: getJointIds(state.jointIds, action),
    };
    case WorldActions.REMOVE_JOINTS: {
      const jointIds = getJointIds(state.jointIds, action);
      return {
        ...state,
        joints: getEntitiesByIds(jointIds, state.joints),
        jointIds,
      };
    }
    case WorldActions.UPDATE_JOINTS:
    case WorldActions.ADD_ANCHOR:
    case WorldActions.REMOVE_ANCHORS:
    case WorldActions.UPDATE_ANCHORS:
      return { ...state, joints: getJoints(state.joints, action) };
    case ProjectActions.LOAD_PROJECT:
      return { ...state, ...getProject({ app: action.payload }).world };
    default: return state;
  }
};
