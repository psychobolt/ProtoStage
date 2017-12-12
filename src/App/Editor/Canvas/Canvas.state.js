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
  pathIds: number[],
  selectedPathIds: number[],
};

export default {
  paths: {},
  pathIds: [],
  selectedPathIds: [],
  activeTool: 'select',
};
