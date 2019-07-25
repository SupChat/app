import React from 'react'
import Messages from './Messages'
import ChatBox from './ChatBox'
import { makeStyles } from '@material-ui/core'
import ChatHeader from './ChatHeader'

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
  }
})

const Chat = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ChatHeader />
      <Messages />
      <ChatBox />
    </div>
  )
}

export default Chat
