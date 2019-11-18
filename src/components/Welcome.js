import React, { useEffect } from 'react'
import { ConnectedRouter, push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt'

import { auth } from '../firebase'
import * as firebase from 'firebase/app'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { blue, cyan, green, lightGreen, purple } from '@material-ui/core/colors'
import { ThemeProvider } from '@material-ui/styles'
import SignUp from './SignUp'
import { Logo } from './Logo'

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
    flexDirection: 'column'
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
  }, [currentUser, dispatch])

  return (
    <div className={classes.root}>
      <Navbar />

      <div className={classes.page}>

        <Typography variant="h6" className={classes.margin}>
          Welcome to <Logo />


          {/*<img style={{ width:30,height: 30, verticalAlign: 'middle' }} src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/chat-circle-blue-512.png" />*/}
        </Typography>
        
        <div className={`${classes.signIn} ${classes.margin}`}>
            <SignUp />
        </div>
      </div>

    </div>
  )
}
