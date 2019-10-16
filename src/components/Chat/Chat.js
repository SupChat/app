import React, { useRef, useState } from 'react'
import Messages from './Messages'
import ChatBox from './ChatBox'
import { makeStyles } from '@material-ui/core'
import ChatHeader from './ChatHeader'
import DropZone from './DropZone'

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
    const [isDragOn, setIsDragOn] = useState(false)

    function onSendMessage() {
        listRef.current.scrollTop = listRef.current.scrollHeight
        setIsDragOn(false)
    }

    function onDragEvent() {
        setIsDragOn(true)
    }

    return (
        <div className={classes.root} onDragEnter={onDragEvent}>
            <ChatHeader />
            <Messages ref={listRef} />
            <ChatBox onSendMessage={onSendMessage} />
            <DropZone isDragOn={isDragOn} onSendMessage={onSendMessage} />
        </div>
    )
}

export default Chat
