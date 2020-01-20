import React, { useEffect } from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import Navbar from '../Navbar'
import Typography from '@material-ui/core/Typography'
import SignUp from './SignUp'
import { Logo } from '../Logo'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  page: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  margin: {
    marginTop: 40,
  },
  signIn: {
    display: 'flex',
    fontFamily: 'sans-serif',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}))


export default function Welcome() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const currentUser = useSelector((store) => store.auth.user)

  useEffect(() => {
    if (currentUser) {
      dispatch(push('/'))
    }
  }, [ currentUser, dispatch ])

  return (
    <div className={classes.root}>
      <Navbar />

      <div className={classes.page}>

        <Typography variant="h6" className={classes.margin}>
          Welcome to <Logo />
        </Typography>

        <div className={`${classes.signIn} ${classes.margin}`}>
          <SignUp />
        </div>
      </div>

    </div>
  )
}
