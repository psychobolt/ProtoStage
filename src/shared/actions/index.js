export const Actions = {
  UNDO: 'undo',
  REDO: 'redo',
};

export const undo = () => ({
  type: Actions.UNDO,
});

export const redo = () => ({
  type: Actions.REDO,
});
