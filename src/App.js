import React, { useEffect } from 'react'
import './App.css'
import { Route, Switch } from 'react-router'
import PrivateRoute from './components/PrivateRoute'
import Home from './components/Home/Home'
import Welcome from './components/Welcome'
import { setUser } from './state/actions/auth'
import { auth, db, messaging } from './firebase'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    function handleTokenRefresh() {
      return messaging.getToken().then((token) => {
        console.log('token', token)
        db.collection('users')
          .doc(auth.currentUser.uid)
          .set({ token }, { merge: true })
      })
    }

    function onAuthStateChanged(user) {
      if (user) {
        const { uid: id, displayName, photoURL, email, phoneNumber } = user
        db.collection('users').doc(user.uid).set({ id, displayName, photoURL, email, phoneNumber })

        Notification.requestPermission()
          .then(handleTokenRefresh)
          .catch((err) => console.log('error getting permission :(', err))

        messaging.onTokenRefresh(handleTokenRefresh)

        messaging.onMessage((what) => {
          console.log('onMessage!!!!!!!!!!!!!!!!!!', what)
        })
      }

      dispatch(setUser(user))
    }

    auth.onAuthStateChanged(onAuthStateChanged)
  }, [dispatch])

  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <PrivateRoute path="/" component={Home} />
    </Switch>
  )
}

export default App
