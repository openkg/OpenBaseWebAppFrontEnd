import request from '../utils/request';

export function login(username, password) {
  return request('/doLogin', { username, password }).catch(error => {
    console.log(error);
  });
}
export function getCode(telphone, ticket, randstr) {
  return request('/user/smscode', { user_phone_number: telphone, ticket, random_string: randstr }, { method: 'POST' }).catch(error => {
    console.log(error);
  });
}

export default login;
