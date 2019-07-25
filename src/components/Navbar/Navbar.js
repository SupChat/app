import React, { useEffect, useState } from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Profile from './Profile'
import SignIn from './SignIn'
import Badge from '@material-ui/core/Badge'
import MailIcon from '@material-ui/icons/Mail'

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
  }
}))


export default function Navbar() {
  const classes = useStyles()
  const currentUser = useSelector(store => store.auth.user)
  const conversations = useSelector(store => store.conversations.conversations)
  const [msgCount] = useState(0)

  useEffect(() => {
    // Promise.all(
    //   Object
    //     .keys(conversations)
    //     .map(conversationId => {
    //       return (
    //         db.collection('messages')
    //           .doc(conversationId)
    //           .collection('list')
    //           .get()
    //       )
    //     })
    // )
    //   .then((msgs) => {
    //       console.log(msgs)
    //       setMsgCount(
    //         (msgs || [])
    //           .map(ref => (ref.docs || []).map(doc => doc.data()))
    //           .flat()
    //           .reduce((count, message) => {
    //             const read = message.from === currentUser.uid || message.read.includes(currentUser.uid)
    //             return read ? count : count + 1
    //           }, 0))
    //     }
    //   )
  }, [conversations, currentUser])

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
                <React.Fragment>
                  <Badge className={classes.msgBadge} badgeContent={msgCount} color="secondary">
                    <MailIcon />
                  </Badge>
                  <Profile />
                </React.Fragment>
              ) : <SignIn />
            }
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
