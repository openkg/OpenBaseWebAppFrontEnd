import { applyMiddleware, createStore, compose } from 'redux';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';

const win = window;
const middlewares = [thunkMiddleware];

const storeEnhancers = compose(applyMiddleware(...middlewares), win && win.devToolsExtension ? win.devToolsExtension() : f => f);

const initialState = {};
const store = createStore(reducer, initialState, storeEnhancers);
const history = syncHistoryWithStore(hashHistory, store);

export { history };
export default store;
