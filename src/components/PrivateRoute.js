import * as React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'

class PrivateRoute extends React.Component {
  routeRender = () => {
    const { component: Component, user, initialized } = this.props
    console.log(user ? 'home' : 'redirect welcome')
    return user ? (<Component />) : initialized ? <Redirect to='/welcome' /> : <div> Loading... </div>
  }

  render() {
    const { component, user, ...rest } = this.props
    return (
      <Route {...rest} render={this.routeRender} />
    )
  }

}

const mapStateToProps = (store) => ({
  user: store.auth.user,
  initialized: store.auth.initialized,
})

export default connect(mapStateToProps)(PrivateRoute)
