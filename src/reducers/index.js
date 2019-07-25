import { combineReducers } from 'redux'
import auth from './auth'
import { connectRouter } from 'connected-react-router'
import conversations from './conversations'
import users from './users'

export default (history) => combineReducers({
  router: connectRouter(history),
  auth,
  conversations,
  users
})
