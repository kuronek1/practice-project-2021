import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import combineReducers from '../reducers/index';
import rootSaga from '../sagas/rootSaga';
import { initSocket } from '../api/ws/socketController';

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
  const store = createStore(
    combineReducers,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga, store.dispatch);
  initSocket(store);
  return store;
}

const store = configureStore();

export default store;
