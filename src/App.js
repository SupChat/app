import React from 'react'
import './App.css'
import Theme from './Theme'
import Auth from './Auth'
import { Route, Switch } from 'react-router'
import Welcome from './components/Welcome'
import Home from './components/Home/Home'
import PrivateRoute from './components/PrivateRoute'
import BaseStyle from './components/BaseStyle'

const App = () => {
  return (
    <Theme>
      <Auth>
        <Switch>
          <BaseStyle>
            <Route path="/welcome" component={Welcome} />
            <PrivateRoute path="/" component={Home} />
          </BaseStyle>
        </Switch>
      </Auth>
    </Theme>
  )
}

export default App
