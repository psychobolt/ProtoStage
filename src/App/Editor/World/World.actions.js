import Hashids from 'hashids';

export const Actions = {
  UPDATE_GRAVITY: 'updateGravity',
  SET_PIXELS_PER_METER: 'setPixelsPerMeter',
  ADD_BODY: 'addBody',
  REMOVE_BODIES: 'removeBodies',
  UPDATE_BODIES: 'updateBodies',
  ADD_BODY_LINKS: 'addBodyLinks',
  ADD_FIXTURES: 'addFixtures',
  REMOVE_FIXTURES: 'removeFixtures',
  UPDATE_FIXTURES: 'updateFixtures',
  SELECT_BODY: 'selectBody',
  ADD_JOINT: 'addJoint',
  REMOVE_JOINTS: 'removeJoints',
  UPDATE_JOINTS: 'updateJoints',
  ADD_ANCHOR: 'addAnchor',
  REMOVE_ANCHORS: 'removeAnchors',
  UPDATE_ANCHORS: 'updateAnchors',
  TOGGLE_PAUSE: 'togglePause',
  TOGGLE_TRACKING: 'toggleTracking',
  UPDATE_MOUSE_FORCE: 'updateMouseForce',
  UPDATE_SPEED: 'updateSpeed',
  RESET: 'reset',
};

export const updateGravity = gravity => ({ type: Actions.UPDATE_GRAVITY, payload: gravity });

export const setPixelsPerMeter = value => ({
  type: Actions.SET_PIXELS_PER_METER, payload: { value },
});

export const addBody = skipHistory => ({
  type: Actions.ADD_BODY,
  payload: {
    id: new Hashids('body').encode(new Date().getTime()),
    fixtureIds: [],
    type: 'static',
    linearVelocity: { x: 0, y: 0 },
    linearDamping: 0,
    angularDamping: 0,
    bullet: false,
  },
  meta: { skipHistory },
});

export const removeBodies = ids => ({ type: Actions.REMOVE_BODIES, payload: { ids } });

export const updateBodies = bodies => ({ type: Actions.UPDATE_BODIES, payload: bodies });

export const addFixtures = (bodyId, fixtures, skipHistory) => ({
  type: Actions.ADD_FIXTURES,
  payload: {
    bodyId,
    fixtures: fixtures.map((fixture, index) => ({
      id: new Hashids('fixture').encode(index, new Date().getTime()),
      bodyId,
      density: 0,
      friction: 0,
      restitution: 0,
      ...fixture,
    })),
  },
  meta: { skipHistory },
});

export const removeFixtures = (ids, skipHistory) => ({
  type: Actions.REMOVE_FIXTURES, payload: { ids }, meta: { skipHistory },
});

export const updateFixtures = fixtures => ({ type: Actions.UPDATE_FIXTURES, payload: fixtures });

export const selectBody = id => ({
  type: Actions.SELECT_BODY, payload: { id }, meta: { skipHistory: true },
});

export const addJoint = options => ({
  type: Actions.ADD_JOINT,
  payload: {
    id: new Hashids('joint').encode(new Date().getTime()),
    anchors: {},
    enableMotor: false,
    maxMotorTorque: 0,
    motorSpeed: 0,
    ...options,
  },
});

export const removeJoints = ids => ({ type: Actions.REMOVE_JOINTS, payload: { ids } });

export const updateJoints = joints => ({ type: Actions.UPDATE_JOINTS, payload: joints });

export const addAnchor = (jointId, anchor) => ({
  type: Actions.ADD_ANCHOR,
  payload: {
    id: new Hashids('anchor').encode(new Date().getTime()),
    jointId,
    ...anchor,
  },
});

export const removeAnchors = (jointId, anchorIds) => ({
  type: Actions.REMOVE_ANCHORS, payload: { jointId, anchorIds },
});

export const updateAnchors = (jointId, anchors) => ({
  type: Actions.UPDATE_ANCHORS, payload: { jointId, anchors },
});

export const togglePause = () => ({ type: Actions.TOGGLE_PAUSE });

export const toggleTracking = () => ({ type: Actions.TOGGLE_TRACKING });

export const updateMouseForce = force => ({ type: Actions.UPDATE_MOUSE_FORCE, payload: force });

export const updateSpeed = speed => ({ type: Actions.UPDATE_SPEED, payload: speed });

export const reset = () => ({ type: Actions.RESET, payload: { id: new Hashids('world').encode(new Date().getTime()) } });
