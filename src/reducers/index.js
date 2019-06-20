import { combineReducers } from 'redux'
import messages from './messages'
import auth from './auth'
import { connectRouter } from 'connected-react-router'

export default (history) => combineReducers({
  router: connectRouter(history),
  messages,
  auth,
})
