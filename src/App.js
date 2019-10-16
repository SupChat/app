import React from 'react'
import './App.css'
import { Route, Switch } from 'react-router'
import PrivateRoute from './components/PrivateRoute'
import Home from './components/Home/Home'
import Welcome from './components/Welcome'
import { Auth } from './Auth'

const App = () => (
  <Switch>
    <Auth>
      <Route path="/welcome" component={Welcome} />
      <PrivateRoute path="/" component={Home} />
    </Auth>
  </Switch>
)

export default App
