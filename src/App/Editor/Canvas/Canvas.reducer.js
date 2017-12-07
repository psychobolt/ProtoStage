import undoable from 'redux-undo';

import initialState from './Canvas.state';
import { Actions } from './Canvas.actions';
import { Actions as GlobalActions } from '../../../shared/actions';

export default undoable((state = initialState, action) => {
  switch (action.type) {
    case Actions.ADD_PATH: {
      const { id } = action.payload;
      return {
        ...state,
        paths: {
          ...state.paths,
          [id]: action.payload,
        },
        pathIds: state.pathIds.concat(id),
      };
    }
    default:
      return state;
  }
}, {
  undoType: GlobalActions.UNDO,
  redoType: GlobalActions.REDO,
});
