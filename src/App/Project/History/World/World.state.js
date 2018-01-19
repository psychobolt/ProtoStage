import Hashids from 'hashids';

export const defaultBody = {
  id: new Hashids('default_body').encode(0),
  fixtureIds: [],
  type: 'static',
  linearVelocity: { x: 0, y: 0 },
  linearDamping: 0,
  angularDamping: 0,
};

export default {
  bodies: {
    [defaultBody.id]: defaultBody,
  },
  bodyIds: [defaultBody.id],
  fixtures: {},
  fixtureIds: [],
  activeBody: defaultBody.id,
  joints: {},
  jointIds: [],
};
