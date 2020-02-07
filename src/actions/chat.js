import request from '../utils/request';
import user from '../utils/localData';
import { getProfessionInfo } from './profession';

export const CHAT_LOGIN = 'CHAT_LOGIN';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SET_CHAT_STATUS = 'SET_CHAT_STATUS';
export const CHAT_STATUS = {
  CHAT_STATUS_OPEN: 'CHAT_STATUS_OPEN',
  CHAT_STATUS_CLOSE: 'CHAT_STATUS_CLOSE',
};
export const SET_CONTENT_STATUS = 'SET_CONTENT_STATUS';
export const CONTENT_STATUS = {
  CONTENT_STATUS_OPEN: 'CONTENT_STATUS_OPEN',
  CONTENT_STATUS_CLOSE: 'CONTENT_STATUS_CLOSE',
};
export const SET_TAP_STATUS = 'SET_TAP_STATUS';
export const TAP_STATUS = {
  TAP_STATUS_GRAPH: 'TAP_STATUS_GRAPH',
  TAP_STATUS_LIST: 'TAP_STATUS_LIST',
};
export const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE';

export const chatLogin = options => {
  return dispatch => {
    const { data } = options;

    request('/initSession', data, { method: 'POST' })
      .then(res => {
        const { code, data } = res;
        if (code === 0) {
          dispatch({
            type: chatLogin,
            data,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};
const appKey = '4b6c71ae-3543-444a-bfe5-eb7586ab0657';

// 发送消息
export const sendMessage = options => {
  return dispatch => {
    const { content } = options;
    const token = user.token();
    const clientData = {
      content,
      token,
      self: 1,
      date: Date.now(),
    };
    dispatch({
      type: SEND_MESSAGE,
      data: Object.assign({}, clientData),
    });

    request(
      `https://api.ruyi.ai/v1/message/`,
      {
        q: content,
        app_key: appKey,
        user_id: '',
      },
      { method: 'GET' }
    )
      .then(res => {
        const { code, result } = res;
        if (code === 0) {
          const data = result.intents.pop();
          const serverData = {
            content: data.result.text,
            self: 0,
            token,
            date: Date.now(),
          };
          dispatch({
            type: SEND_MESSAGE,
            data: Object.assign({}, serverData),
          });
          if (data.parameters && data.parameters.scholar) {
            dispatch(
              getProfessionInfo({
                masterScholar: data.parameters.id,
              })
            );
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// 关闭chat
export const setChatStatus = options => {
  return {
    type: SET_CHAT_STATUS,
    status: options.CHAT_STATUS,
  };
};

// 打开或者关闭contentStatus
export const setContentStatus = options => {
  return {
    type: SET_CONTENT_STATUS,
    payload: options.payload,
  };
};

export const setTapStatus = options => {
  return {
    type: SET_TAP_STATUS,
    payload: options.payload,
  };
};

export const setSearchValue = options => {
  return {
    type: SET_SEARCH_VALUE,
    payload: options.payload,
  };
};
