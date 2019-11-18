import React from 'react'
import './App.css'
import { Route, Switch } from 'react-router'
import PrivateRoute from './components/PrivateRoute'
import Home from './components/Home/Home'
import Welcome from './components/Welcome'
import { Auth } from './Auth'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    position: 'absolute',
    top: 0,
    width: '100vw',
    height: '100vh',
    left: 0,
  },
}))

const App = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Switch>
        <Auth>
          <Route path="/welcome" component={Welcome} />
          <PrivateRoute path="/" component={Home} />
        </Auth>
      </Switch>
    </div>
  )
}

export default App
