import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { auth } from '../../firebase'

const useStyles = makeStyles({
  signOut: {
    color: 'white',
    marginLeft: 'auto',
    fontFamily: 'sans-serif',
  },
})

const SignOut = () => {
  const classes = useStyles()

  function signOut() {
    auth.signOut()
  }

  return (
    <React.Fragment>
      <Button className={classes.signOut} onClick={signOut}>
        Sign Out
      </Button>
    </React.Fragment>
  )
}

export default SignOut
