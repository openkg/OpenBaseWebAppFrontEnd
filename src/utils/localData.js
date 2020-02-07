import history from './history';

export const getRole = () => {
  const role = sessionStorage.getItem('role') || '4';
  return role;
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};
export const getUserInfo = (redirect = true) => {
  const userInfo = sessionStorage.getItem('userInfo');
  if (redirect && !userInfo) {
    history.push('/');
    return {};
  }
  return JSON.parse(userInfo);
};

export default {
  role: getRole,
  token: getToken,
  userInfo: getUserInfo,
};
