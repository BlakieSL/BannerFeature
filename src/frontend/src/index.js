import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/index.scss';
import './css/App.scss'
import * as serviceWorker from './serviceWorker';
import rootReducer from './reducers/index'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
