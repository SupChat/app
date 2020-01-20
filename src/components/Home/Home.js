import React, { useEffect } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useDispatch } from 'react-redux'
import { db } from '../../firebase'
import { setUsers } from '../../state/actions/users'
import Navbar from './Navbar/Navbar'
import Routes from './Routes/Routes'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
}))

const Home = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  useEffect(() => {
    return db.collection('users')
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map(doc => doc.data())
        dispatch(setUsers(users.reduce((prev, user) => ({ ...prev, [user.id]: user }), {})))
      })
  }, [ dispatch ])

  return (
    <div className={classes.root}>
      <Navbar />
      <Routes />
    </div>
  )
}

export default Home 
