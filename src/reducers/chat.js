import { CHAT_LOGIN, SEND_MESSAGE, SET_CHAT_STATUS, SET_CONTENT_STATUS, SET_TAP_STATUS, SET_SEARCH_VALUE } from '../actions/chat';

const initStates = {
  chatStatus: 'CHAT_STATUS_OPEN',
  contentStatus: 'CONTENT_STATUS_CLOSE',
  tapStatus: 'TAP_STATUS_GRAPH',
  id: 1,
  user: {
    name: '使用帮助',
    img: 'https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg',
  },
  messages: [],
  searchValue: '',
};
export default function chatReducers(state = initStates, action) {
  switch (action.type) {
    case CHAT_LOGIN:
      return Object.assign({}, state, {
        ...initStates,
      });
    case SEND_MESSAGE:
      return Object.assign({}, state, {
        messages: [...state.messages, action.data],
      });

    case SET_CHAT_STATUS:
      return Object.assign({}, state, {
        chatStatus: action.status,
      });

    case SET_CONTENT_STATUS:
      return Object.assign({}, state, {
        contentStatus: action.payload,
      });

    case SET_TAP_STATUS:
      return Object.assign({}, state, {
        tapStatus: action.payload,
      });

    case SET_SEARCH_VALUE:
      return Object.assign({}, state, {
        searchValue: action.payload,
      });
    default:
      return state;
  }
}
