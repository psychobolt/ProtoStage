import Hashids from 'hashids';

export default {
  id: new Hashids('world').encode(new Date().getTime()),
  paused: false,
  tracking: false,
};
