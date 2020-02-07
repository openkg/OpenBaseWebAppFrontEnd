import { GET_PROFESSION_INFO } from '../actions/profession';

export default function professionReducer(state = {}, action) {
  switch (action.type) {
    case GET_PROFESSION_INFO:
      return Object.assign({}, state, {
        ...action.payload,
      });

    default:
      return state;
  }
}
