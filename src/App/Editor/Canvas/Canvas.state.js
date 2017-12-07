// @flow
type Path = {
  id: number,
  type: string,
  pathData: string,
};

export type Canvas = {
  paths: {
    [number]: Path
  },
  pathIds: number[]
};

export default {
  paths: {},
  pathIds: [],
};
