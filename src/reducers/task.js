import { GET_AUDIT_TASK_SUCCESS, CONTINUE_AUDIT_TASK_SUCCESS, GET_CHECK_TASK_SUCCESS, CONTINUE_CHECK_TASK_SUCCESS } from '../actions/task';

export default function fetchEntities(state = {}, action) {
  switch (action.type) {
    case GET_AUDIT_TASK_SUCCESS:
    case CONTINUE_AUDIT_TASK_SUCCESS:
    case GET_CHECK_TASK_SUCCESS:
    case CONTINUE_CHECK_TASK_SUCCESS:
      return action.result.data || {};
    default:
      return state;
  }
}
