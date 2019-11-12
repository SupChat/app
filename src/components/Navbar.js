import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
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

  return (
    <AppBar position='relative'>
      <Toolbar className={classes.root}>
        <Typography color="inherit" className="flex">
          Sup Chat
        </Typography>
        <div className={classes.leftSize}>
          <SignIn />
        </div>
      </Toolbar>
    </AppBar>
  )
}

