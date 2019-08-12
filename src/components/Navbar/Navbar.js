import React, { useState } from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Profile from './Profile'
import SignIn from './SignIn'
import SignOut from './SignOut'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

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
  msgBadge: {
    margin: '0 10px',
    cursor: 'pointer',
  },
  leftSize: {
    marginLeft: 'auto',
  },
}))


export default function Navbar() {
  const classes = useStyles()
  const currentUser = useSelector(store => store.auth.user)
  const conversations = useSelector(store => store.conversations.conversations)
  const [msgCount] = useState(0)

  return (
    <div>
      <AppBar position='relative'>
        <Toolbar className={classes.root}>
          <Typography color="inherit" className="flex">
            CHAT
          </Typography>
          <div className={classes.leftSize}>
            {
              currentUser ? (
                <Grid container>
                  <SignOut />
                  <Profile />
                </Grid>
              ) : <SignIn />
            }
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

// {/*<Badge className={classes.msgBadge} badgeContent={msgCount} color="secondary">*/}
// {/*<MailIcon />*/}
// {/*</Badge>*/}
