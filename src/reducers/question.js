import { FETCH_QUESTION_SUCCESS, SUBMIT_QUESTION_SUCCESS } from '../actions/question';

export default function fetchQuestion(state = {}, action) {
  switch (action.type) {
    case FETCH_QUESTION_SUCCESS:
      return Object.assign({}, state, {
        questions: action.result.data,
      });
    case SUBMIT_QUESTION_SUCCESS:
      return Object.assign({}, state, {
        result: action.result.data,
      });
    default:
      return state;
  }
}
