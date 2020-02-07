import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import root from './root';
import userinfo from './user';
import questions from './question';
import tasks from './task';
import sumary from './sumary';
import relationships from './relationship';
import chat from './chat';
import profession from './profession';

const rootReducer = combineReducers({
  routing: routerReducer,
  root,
  userinfo,
  questions,
  sumary,
  tasks,
  relationships,
  chat,
  profession,
});

export default rootReducer;
