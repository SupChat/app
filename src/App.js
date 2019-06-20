import React from 'react'
import './App.css'
import { Route, Switch } from 'react-router'
import PrivateRoute from './components/PrivateRoute'
import Home from './components/Home'
import Wellcome from './components/Wellcome'
import Navbar from './components/Navbar/Navbar'
import { setUser } from './actions/auth'
import { auth } from './firebase'
import { connect } from 'react-redux'

class App extends React.Component {
  componentDidMount() {
    const { setUser } = this.props
    auth.onAuthStateChanged((user) => {
      setUser(user)
    })
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="App">
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

export default connect(null, mapDispatchToProps)(App)
