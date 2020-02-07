import fetch from 'isomorphic-fetch';
import history from './history';
import message from '../components/common/Message';
// TODO: set `URL_BASE` according to your server API, must end with `/`
const URL_BASE = '/';
const ABSOLUTE_URL_REG = /^(http|\/)/i;

const statusMap = {
  204: '资源未找到',
  400: '参数错误',
  401: '访问被拒绝，请重新登陆',
  403: '没有权限进行此操作',
  404: '接口不存在',
  405: '方法不被允许',
  500: '服务器错误',
  502: '错误网关，请稍后再试',
  504: '请求超时',
};

const disableLoadingURL = ['edit/searchPropertyNameList'];

function toString(params) {
  const array = [];
  Object.keys(params).forEach(name => {
    array.push(`${name}=${params[name]}`);
  });

  return array.join('&');
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url The URL we want to request. Can be absolute URL or
 * relative URL, the relative URL will concat after `URL_BASE` and should
 * neithor start with `/` nor `.`
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {boolean} [options.notParseAsJson=false] If `true`, not parse
 * response as JSON
 * @return {Promise<Object>} The object may contain parsed data, response
 * object itself, or thrown error
 */
export default function request(url, params, options = {}) {
  if (!disableLoadingURL.includes(url)) {
    message.loading(true);
  }
  const { notParseAsJson = false } = options;
  const { credentials, method = 'GET' } = options;

  if (method === 'POST') {
    const body = JSON.stringify(params);
    options = { ...options, headers: { 'content-type': 'application/json; charset=UTF-8' }, body };
  } else {
    url += `?${toString(params)}`;
  }
  if (!(typeof credentials === 'string' && credentials.length > 0)) {
    options = {
      ...options,
      credentials: method === 'GET' ? 'same-origin' : 'include',
    };
  }
  // support provide absolute URL like below to not use `URL_BASE`:
  // * https://example.com/api/balabala
  // * http://example.com/api/balabala
  // * /api/balabala
  if (!ABSOLUTE_URL_REG.test(url)) {
    url = `${URL_BASE}${url}`;
  }
  return fetch(url, options)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const { status, statusText } = response;
      const error = { code: status, msg: statusMap[status] || statusText || '位置错误' };
      throw error;
    })
    .then(res => {
      if (!notParseAsJson) {
        return res.json();
      }
      return res;
    })
    .then(res => {
      const { code } = res;
      // if (code === 2) {
      //   history.push('/')
      //   sessionStorage.clear()
      // }
      // if (Object.getOwnPropertyNames(res).includes('token') && !res.token) {
      //   history.push('/')
      //   sessionStorage.clear()
      // }
      message.loading(false);
      return res;
    })
    .catch(error => {
      message.loading(false);
      return error;
    });
}
