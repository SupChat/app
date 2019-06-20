import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import DialogContent from '@material-ui/core/DialogContent'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import * as firebase from 'firebase/app'
import { auth } from '../../firebase'

const useStyles = makeStyles({
  dialog: {
    display: 'flex',
    alignItems: 'center'
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    '& button': {
      margin: 5,
      textTransform: 'none',
      padding: '8px 44px',
    }
  },
  icon: {
    margin: 5,
  },
  signIn: {
    color: 'white',
    marginLeft: 'auto',
    display: 'flex',
    fontFamily: 'sans-serif',
  },
  googleBtn: {
    color: 'rgb(68, 132, 234)'
  },
  githubBtn: {
    color: 'rgb(50, 50, 50)',
  }
})

const SignIn = () => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  function googleSignIn() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(googleAuthProvider)
      .then((data) => console.log(data))
      .catch(error => console.log(error))
  }

  function githubSignIn() {
    const githubAuthProvider = new firebase.auth.GithubAuthProvider()
    auth.signInWithPopup(githubAuthProvider)
      .then((data) => console.log(data))
      .catch(error => console.log(error))

  }

  return (
    <React.Fragment>
      <Button className={classes.signIn} onClick={() => setOpen(true)}>
        Sign In
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">Sign In</DialogTitle>
        <DialogContent className={classes.dialog}>
          <DialogContent className={classes.dialogContent}>
            <Button className={classes.googleBtn} onClick={googleSignIn} variant='outlined'>
              <FontAwesomeIcon className={classes.icon} icon={faGoogle} />
              Sign in with Google
            </Button>
            <Button className={classes.githubBtn} onClick={githubSignIn} variant='outlined'>
              <FontAwesomeIcon className={classes.icon} icon={faGithub} />
              Sign in with Github
            </Button>
          </DialogContent>

        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default SignIn
