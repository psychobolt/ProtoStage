import initialState from './World.state';
import { Actions } from './World.actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.TOGGLE_TRACKING: return { ...state, tracking: !state.tracking };
    case Actions.TOGGLE_PAUSE: return { ...state, paused: !state.paused };
    case Actions.RESET: return { ...state, id: action.payload.id };
    default: return state;
  }
};
