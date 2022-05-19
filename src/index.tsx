import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
import {store} from "./store/store";
import {App} from "./App";
import {HashRouter} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App/>
    </HashRouter>
  </Provider>
  , document.getElementById('root'));

reportWebVitals();