import { FETCH_RECORD_SUCCESS, UPDATE_SOURCE } from '../actions/sumary';

export default function sumaryReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_RECORD_SUCCESS:
      return action.result;
    case UPDATE_SOURCE:
      state.source = action.source;
      return { ...state };
    default:
      return state;
  }
}
