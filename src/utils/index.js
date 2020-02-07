import * as debounce from './debounce';
import * as history from './history';
import * as localData from './localData';
import * as request from './request';
import Dialog from '../components/common/Dialog';

export { showLoading } from '../actions/root';

let modal = null;
Dialog.newInstance({}, instance => {
  modal = instance;
});
const showDialog = option => {
  modal.show({
    content: option.content,
    onClose: () => {
      modal.close();
      option.redirectPath && history.redirect(option.redirectPath) // eslint-disable-line

      if (typeof option.onClose === 'function') {
        option.onClose();
      }
    },
  });
};
const errorHandler = data => {
  let content = '未知错误';
  let redirectPath = '/';
  let result = true;
  if (!data) {
    result = false;
    showDialog({ content, redirectPath });
  } else if (data.code === 2) {
    result = false;
    content = data.msg;
    redirectPath = '/login';
    sessionStorage.clear();
    showDialog({ content, redirectPath });
  } else if (data.code !== 0) {
    result = false;
    content = data.msg;
    redirectPath = '/index/userinfo';
    showDialog({ content, redirectPath });
  }
  if (result) {
    return data;
  }
  return new Promise(() => {});
};
const auditResponseHandler = data => {
  const { type, jobId = '' } = data.data;
  const { hash } = window.location;
  let redirectPath = '';
  if (type === 'triple' && hash.indexOf('auditRelationship') === -1) {
    redirectPath = `/index/auditRelationship/${jobId}`;
  } else if (type === 'entity' && hash.indexOf('auditEntity') === -1) {
    redirectPath = `/index/auditEntity/${jobId}`;
  }
  if (redirectPath !== '') {
    history.redirect(redirectPath);
    return new Promise(() => {});
  }
  return data;
};
const checkResponseHandler = data => {
  const { type, jobId = '' } = data.data;
  const { hash } = window.location;
  let redirectPath = '';
  if (type === 'triple' && hash.indexOf('checkRelationship') === -1) {
    redirectPath = `/index/checkRelationship/${jobId}`;
  } else if (type === 'entity' && hash.indexOf('checkEntity') === -1) {
    redirectPath = `/index/checkEntity/${jobId}`;
  }
  if (redirectPath !== '') {
    history.redirect(redirectPath);
    return new Promise(() => {});
  }
  return data;
};
const randomInt = (min = 0, max = 100) => {
  const num = Math.floor(Math.random() * (min - max) + max);
  return num;
};
export { debounce, history, localData, request, showDialog, errorHandler, randomInt, auditResponseHandler, checkResponseHandler };
