import {
  REQUEST_FAILURE,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  GET_USER_INFO_SUCCESS,
  SET_USER_INFO_SUCCESS,
  SET_USER_HEAD_PICTURE,
  UPDATE_USER_INFO,
} from '../actions/user';

export default function userReducers(state = {}, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return Object.assign({}, state, {
        token: action.result.token,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        token: action.result.token,
      });
    case LOGOUT_SUCCESS:
      return {};
    case GET_USER_INFO_SUCCESS:
      return action.userinfo;
    case UPDATE_USER_INFO:
      return Object.assign({}, state, action.payload);
    case SET_USER_INFO_SUCCESS:
      return Object.assign({}, state, {
        token: action.result.token,
      });
    case SET_USER_HEAD_PICTURE:
      return Object.assign({}, state, {
        userinfo: action.result.data,
      });
    case REQUEST_FAILURE:
      return { error: action.error.msg };
    default:
      return state;
  }
}
