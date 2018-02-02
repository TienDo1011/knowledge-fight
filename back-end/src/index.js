import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Room from './room/Room';
import SignIn from './auth/SignIn';
import Register from './auth/Register';

const sagaMiddleWare = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(sagaMiddleWare)
));

sagaMiddleWare.run(rootSaga);

const theme = createMuiTheme({
  palette: {
    type: 'light'
  }
})

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
  <Provider store={store}>
      <Router>
        <div>
          <Route exact path="/" component={App} />
          <Route path="/:roomId" component={Room} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/register" component={Register} />
        </div>
      </Router>
  </Provider>
    </MuiThemeProvider>,
  document.getElementById('root'));
registerServiceWorker();
