import React, { useRef, useState } from 'react'
import Messages from './Messages'
import ChatBox from './ChatBox'
import { makeStyles } from '@material-ui/core'
import ChatHeader from './ChatHeader'
import DropZone from './DropZone'
import uuid from 'uuid'
import { db, storage } from '../../firebase'
import { useSelector } from 'react-redux'
import { selectActiveConversation } from '../../actions/conversations'
import FileDialog from './FileDialog'

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
})

const Chat = () => {
  const classes = useStyles()
  const listRef = useRef()
  const [isDragOn, setIsDragOn] = useState(false)
  const [file, setFile] = React.useState(null)

  const currentUser = useSelector(store => store.auth.user)
  const activeConversation = useSelector(selectActiveConversation)

  async function onSendMessage(text) {
    listRef.current.scrollTop = listRef.current.scrollHeight
    setIsDragOn(false)
    setFile(null)

    const msgId = uuid()

    const messageRef = db
      .collection('conversations')
      .doc(activeConversation.id)
      .collection('messages')
      .doc(msgId)

    await messageRef.set({
      id: msgId,
      text,
      ...(file ? { file: 'pending' } : {}),
      from: currentUser.uid,
      date: new Date(),
    })

    if (file) {
      const fileRef = await storage.ref(`conversations/${activeConversation.id}/${msgId}`).put(file).then((snapshot) => snapshot.ref.getDownloadURL())
      await messageRef.set({ file: fileRef }, { merge: true })
    }
  }

  function onDragEnter() {
    setIsDragOn(true)
  }

  function onDragLeave() {
    setIsDragOn(false)
  }

  return (
    <div className={classes.root} onDragEnter={onDragEnter}>
      <ChatHeader />

      <Messages ref={listRef} isDragOn={isDragOn} />

      <ChatBox
        attachFile={setFile}
        onSendMessage={onSendMessage} />

      <FileDialog
        file={file}
        onClose={() => setFile(null)}
        onDone={onSendMessage} />

      {
        isDragOn && (
          <DropZone
            onDragLeave={onDragLeave}
            setFile={setFile} />
        )
      }

    </div>
  )
}

export default Chat
