import { Route, Switch } from 'react-router'
import Welcome from './Welcome/Welcome'
import PrivateRoute from './PrivateRoute'
import Home from './Home/Home'
import React from 'react'

const Routes = () => {
  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <PrivateRoute path="/" component={Home} />
    </Switch>
  )
}

export default Routes
