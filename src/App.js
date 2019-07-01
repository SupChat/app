import React from 'react'
import './App.css'
import { Route, Switch } from 'react-router'
import PrivateRoute from './components/PrivateRoute'
import Home from './components/Home'
import Wellcome from './components/Wellcome'
import Navbar from './components/Navbar/Navbar'
import { setUser } from './actions/auth'
import { auth, db } from './firebase'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'

class App extends React.Component {
  componentDidMount() {
    const { setUser } = this.props
    auth.onAuthStateChanged((user) => {
      if (user) {
        const { uid: id,   displayName, photoURL,email, phoneNumber } = user
        db.collection('users').doc(user.uid).set({ id, displayName, photoURL,email, phoneNumber })
      }
      setUser(user)
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Navbar />
        <div className={classes.app}>
          <Switch>
            <Route path="/wellcome" component={Wellcome} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setUser,
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  app: {
    height: 'calc(100vh - 64px)',
  }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(App))
