import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import DialogContent from '@material-ui/core/DialogContent'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import * as firebase from 'firebase/app'
import { auth } from '../firebase'
import { ThemeProvider } from '@material-ui/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { blue, green } from '@material-ui/core/colors'

const useStyles = makeStyles({
  dialog: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    padding: '10px 30px',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    '& button': {
      margin: 5,
      textTransform: 'none',
      padding: '8px 50px',
    }
  },
  signIn: {
    color: 'white',
    marginLeft: 'auto',
    display: 'flex',
    fontFamily: 'sans-serif',
  },
  googleBtn: {
    // background: 'rgb(68, 132, 234)',
    marginBottom: 20,
    width: 300,
    height: 40,
    fontSize: 13,
  },
  githubBtn: {
    // background: '#78ca5c',
    marginBottom: 20,
    width: 300,
    height: 40,
    fontSize: 13,
  },
  icon: {
    fontSize: 25,
    margin: '0 5px',
  },
})

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: green[600],
    },
    primary: {
      main: blue[500],
    },
  },
})

const SignUp = () => {
  const classes = useStyles()

  const googleSignIn = useCallback(() => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(googleAuthProvider)
      .then((data) => console.log(data))
      .catch(error => console.log(error))
  }, [])

  const githubSignIn = useCallback(() => {
    const githubAuthProvider = new firebase.auth.GithubAuthProvider()
    auth.signInWithPopup(githubAuthProvider)
      .then((data) => console.log(data))
      .catch(error => console.log(error))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Button
        className={classes.googleBtn}
        onClick={googleSignIn}
        color="primary"
        variant="contained">
        <FontAwesomeIcon className={classes.icon} icon={faGoogle} />
        Sign up with Google
      </Button>
      <Button
        className={classes.githubBtn}
        onClick={githubSignIn}
        color="secondary"
        variant="contained">
        <FontAwesomeIcon className={classes.icon} icon={faGithub} />
        Sign up with Github
      </Button>
    </ThemeProvider>
  )
}

export default SignUp
