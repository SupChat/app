import React, { useRef } from 'react'
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
    width: 'calc(100% - 360px)',
  }
})

const Chat = () => {
  const classes = useStyles()
  const listRef = useRef()

  function onSendMessage() {
    listRef.current.scrollTop = listRef.current.scrollHeight
  }

  return (
    <div className={classes.root}>
      <ChatHeader />
      <Messages ref={listRef} />
      <ChatBox onSendMessage={onSendMessage}/>
    </div>
  )
}

export default Chat
