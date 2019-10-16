import React, { useState } from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Profile from './Profile'
import SignOut from './SignOut'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import Fab from '@material-ui/core/Fab'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    fontFamily: 'sans-serif',
    letterSpacing: .6,
    justifyContent: 'space-between',
  },
  appBar: {
    boxShadow: 'none',
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
    // marginLeft: 'auto',
  },
  rightSize: {
    display: 'flex',
    alignItems: 'center',
  },
  showUsers: {
    marginRight: 10,
    background: 'white',
    // color: 'white',
  },
}))


export default function Navbar() {
  const classes = useStyles()
  // const currentUser = useSelector(store => store.auth.user)
  const conversations = useSelector(store => store.conversations.conversations)
  const [msgCount] = useState(0)
  const dispatch = useDispatch()
  const showUsers = useSelector(store => store.ui.showUsers)

  function handleDrawer() {
    dispatch({ type: 'TOGGLE_SHOW_USERS' })
  }

  return (
    <AppBar className={classes.appBar} position='relative'>
      <Toolbar className={classes.root}>
        <div className={classes.rightSize}>
          {
              <Fab size='small' className={classes.showUsers} onClick={handleDrawer}>
                {
                  showUsers ? (
                    <ChevronLeftIcon />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} />
                  )
                }
              </Fab>
          }
          <Typography color="inherit" className="flex">
            CHAT
          </Typography>
        </div>
        <div className={classes.leftSize}>
          <SignOut />
          <Profile />
        </div>
      </Toolbar>
    </AppBar>
  )
}

// {/*<Badge className={classes.msgBadge} badgeContent={msgCount} color="secondary">*/}
// {/*<MailIcon />*/}
// {/*</Badge>*/}
