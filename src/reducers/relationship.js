import { FETCH_LIST_SUCCESS } from '../actions/relationship';

export default function fetchList(state = {}, action) {
  switch (action.type) {
    case FETCH_LIST_SUCCESS: {
      const newState = Object.assign({}, state);
      newState.relationships = action.result || [];
      return action.result || [];
      // return Object.assign({}, state, { relationships: action.result || [] })
    }
    default:
      return state;
  }
}
