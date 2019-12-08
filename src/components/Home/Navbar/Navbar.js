import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ProfileAvatar from './ProfileAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import Fab from '@material-ui/core/Fab'
import { Logo } from '../../Logo'

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
  leftSize: {},
  rightSize: {
    display: 'flex',
    alignItems: 'center',
  },
  showUsers: {
    marginRight: 10,
  },
}))


export default function Navbar() {
  const classes = useStyles()
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
            !showUsers && (
              <Fab size='small' color="secondary" className={classes.showUsers} onClick={handleDrawer}>
                <FontAwesomeIcon icon={faUsers} />
              </Fab>
            )
          }
          <Typography variant="h6">
            <Logo />
          </Typography>
        </div>
        <div className={classes.leftSize}>
          <ProfileAvatar />
        </div>
      </Toolbar>
    </AppBar>
  )
}
