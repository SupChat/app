import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './state/reducers'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import _get from 'lodash/get';

export const history = createBrowserHistory()
export const loggerMiddleware = createLogger()

const preloadedState = _get(JSON.parse(sessionStorage.getItem('_state_')), 'ui', {});

export default function configureStore() {
  const composeEnhancers = composeWithDevTools({})
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // loggerMiddleware,
        thunkMiddleware,
      ),
    ),
  )

  store.subscribe(() => {
    sessionStorage.setItem('_ui_', JSON.stringify(store.getState().ui))
  })

  return store
}

export const store = configureStore()
