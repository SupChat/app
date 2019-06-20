import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Profile from './Profile'
import SignIn from './SignIn'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    fontFamily: 'sans-serif',
    letterSpacing: .6,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
}))


export default function Navbar() {
  const classes = useStyles()
  const user = useSelector(state => state.auth.user)

  return (
    <div>
      <AppBar position='relative'>
        <Toolbar className={classes.root}>
          <Typography color="inherit" className="flex">
            CHAT
          </Typography>
          {
            user ? <Profile /> : <SignIn />
          }
        </Toolbar>
      </AppBar>
    </div>
  )
}
