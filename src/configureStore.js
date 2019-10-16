import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './state/reducers'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

export const history = createBrowserHistory()
export const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({})
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // loggerMiddleware,
        thunkMiddleware
      ),
    ),
  )

  return store
}
