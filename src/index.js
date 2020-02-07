import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.scss';
import Routes from './Routes';
import store, { history } from './Store';

ReactDOM.render(
  <Provider store={store}>
    <div className="app">
      <Routes history={history} />
    </div>
  </Provider>,
  document.getElementById('root')
);
