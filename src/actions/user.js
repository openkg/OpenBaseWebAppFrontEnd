import request from '../utils/request';
import { redirect } from '../utils/history';
import avatar from '../assets/images/avatar.svg';

// const headpic = 'http://openbase.ai/uploads/bf973b614a3a49a99917b81946b94cdc.jpg'

export const REQUEST_START = 'REQUEST_START';
export const REQUEST_FAILURE = 'REQUEST_FAILURE';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const SET_USER_INFO_SUCCESS = 'SET_USER_INFO_SUCCESS';
export const SET_USER_HEAD_PICTURE = 'SET_USER_HEAD_PICTURE';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';

export const requestStart = () => ({
  type: REQUEST_START,
});
export const requestFailure = error => ({
  type: REQUEST_FAILURE,
  error,
});

export const registerSuccess = result => ({
  type: REGISTER_SUCCESS,
  result,
});

export const loginSuccess = result => ({
  type: LOGIN_SUCCESS,
  result,
});

export const logoutSuccess = result => ({
  type: LOGOUT_SUCCESS,
  result,
});

export const getUserInfoSuccess = userinfo => ({
  type: GET_USER_INFO_SUCCESS,
  userinfo,
});

export const setUserInfoSuccess = result => ({
  type: SET_USER_INFO_SUCCESS,
  result,
});

export const setUserHeadPicture = result => ({
  type: SET_USER_HEAD_PICTURE,
  result,
});

export const mapDatatoProps = user => {
  user = user || {};
  return {
    token: user.token,
    fullname: user.user_fullname,
    mobile: user.user_mobile,
    email: user.user_email,
    organization: user.user_organization,
    skilled: user.user_favourite,
    headPortrait: user.user_photo || avatar,
    role: user.role,
  };
};
export const mapStatetoData = user => {
  user = user || {};
  return {
    token: user.token,
    user_fullname: user.fullname,
    user_mobile: user.mobile,
    user_email: user.email,
    user_organization: user.organization,
    user_favourite: user.skilled,
    user_photo: user.headPortrait,
  };
};
/**
 * 用户注册
 * @param {object} param，注册参数
 * @return {Promise} 包含Code、Msg和Token等字段，其中，Code：200表示正确， 500表示服务器出错， 400表示参数不对
 */
export const register = param => {
  return dispatch => {
    dispatch(requestStart());
    const data = mapStatetoData(param);
    data.user_password = param.password;
    data.invitation_token = param.invitation_token;
    data.user_smsverificationcode = param.smscode;
    return request('/user/registe', data, { method: 'POST' })
      .then(data => {
        const { code, token } = data;
        if (code === 0) {
          dispatch(registerSuccess(data));
          // 如果token不为空，则跳转到用户界面，否则，跳转到登录页面
          if (token) {
            // 记录token
            sessionStorage.setItem('token', token);
            redirect('/index');
          } else {
            redirect('/');
          }
        } else {
          dispatch(requestFailure(data));
        }
        return data;
      })
      .catch(error => {
        dispatch(requestFailure(error));
      });
  };
};
/**
 * 用户登录
 * @param {object} param，登录参数，包含user_mobile和user_password两个参数
 * @return {Promise} 包含Code、Msg和Token等字段，其中，Code：200表示正确， 500表示服务器出错， 400表示参数不对
 */
export const loginByAccount = param => {
  return dispatch => {
    dispatch(requestStart());
    return request('/user/login', param, { method: 'POST' })
      .then(data => {
        const { code, token } = data;
        if (code === 0) {
          // 记录token
          sessionStorage.setItem('token', token);

          dispatch(loginSuccess(data));
          redirect('/index');
        } else {
          dispatch(requestFailure(data));
        }
        return data;
      })
      .catch(error => {
        dispatch(requestFailure(error));
        return error;
      });
  };
};
/**
 * 获取用户信息
 * @param {string} token,用户token
 * @return {Promise}
 * 包含Code、Msg、Token和Data等字段，其中，Code：200表示正确， 500表示服务器出错， 400表示参数不对
 */
export const getUserInfo = token => {
  return dispatch => {
    dispatch(requestStart());
    return request(`/user/detail`, { token })
      .then(data => {
        // console.log('TCL: data', data);
        const { code, token } = data;
        if (code === 0) {
          const userinfo = mapDatatoProps(data.data);
          console.log('TCL: userinfo', userinfo);
          const { role } = userinfo;
          // 记录token和role
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('role', role.join(','));
          sessionStorage.setItem('userInfo', JSON.stringify(userinfo));
          dispatch(getUserInfoSuccess(userinfo));
        } else {
          dispatch(requestFailure(data));
        }
        return data;
      })
      .catch(error => {
        console.log('TCL: error', error);
        dispatch(requestFailure(error));
      });
  };
};
/**
 * 获取用户列表
 */
export const getUsers = (token, pageSize, pageIndex) => {
  return request(`/user/userList`, { token, pageSize, pageIndex }).then(data => {
    return data;
  });
};
/**
 * 设置用户角色
 * @param {*} params 参数字段包含：token、user_id和user_role
 */
export const setUserRole = params => {
  return request(`/user/updateRole`, params, { method: 'POST' }).then(data => {
    return data;
  });
};
/**
 * 用户信息修改
 * @param {object} param，用户信息和token
 * @return {Promise} 包含Code、Msg和Token等字段，其中，Code：200表示正确， 500表示服务器出错， 400表示参数不对
 */
export const setUserInfo = param => {
  return dispatch => {
    dispatch(requestStart());
    const data = mapStatetoData(param);
    return request('/user/detailUpdate', data, { method: 'POST' })
      .then(data => {
        const { code, token } = data;
        if (code === 0) {
          // 记录token
          sessionStorage.setItem('token', token);

          dispatch(setUserInfoSuccess(data));
          redirect('/index');
        } else {
          dispatch(requestFailure(data));
        }
      })
      .catch(error => {
        dispatch(requestFailure(error));
      });
  };
};
/**
 * 上传用户头像
 * @param {object} param，filetype、filecontent和token
 * @return {Promise} 包含Code、Msg、Token和Data等字段，
 * 其中，Code：200表示正确， 500表示服务器出错， 400表示参数不对
 */
export const uploadPicture = param => {
  return dispatch => {
    dispatch(requestStart());
    return request('/user/uploadPicture', param, { method: 'POST' })
      .then(data => {
        const { code, token } = data;
        if (code === 0) {
          // 记录token
          sessionStorage.setItem('token', token);

          dispatch(setUserHeadPicture(data));
        } else {
          dispatch(requestFailure(data));
        }
        return data;
      })
      .catch(error => {
        dispatch(requestFailure(error));
      });
  };
};
/**
 * 用户注销
 * @param {string} token，用户token
 * @return {Promise} 包含Code和Msg，其中，Code：200表示正确， 500表示服务器出错， 400表示参数不对
 */
export const logout = token => {
  return dispatch => {
    dispatch(requestStart());
    return request(`/user/logout/`, { token })
      .then(data => {
        const { code } = data;
        if (code === 0) {
          // 清空sessionStorage
          sessionStorage.clear();

          dispatch(logoutSuccess(data));
        } else {
          dispatch(requestFailure(data));
        }
        return data;
      })
      .catch(error => {
        dispatch(requestFailure(error));
      });
  };
};

export const updateUserInfo = payload => {
  return {
    type: UPDATE_USER_INFO,
    payload,
  };
};
