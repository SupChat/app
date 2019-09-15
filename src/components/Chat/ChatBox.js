import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import uuid from 'uuid'
import { selectActiveConversation } from '../../actions/conversations'
import { db, storage } from '../../firebase'
import 'emoji-mart/css/emoji-mart.css'
import FileDialog from './FileDialog'
import Dialog from '@material-ui/core/Dialog'
import ChatInput from './ChatInput'

export default function ChatBox({ onSendMessage }) {
  const [text, setText] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const [file, setFile] = React.useState(null)

  const currentUser = useSelector(store => store.auth.user)
  const activeConversation = useSelector(selectActiveConversation)
  const timeoutRef = useRef()

  useEffect(() => {
    db
      .collection('conversations')
      .doc(activeConversation.id)
      .set({ members: { [currentUser.uid]: { typing } } }, { merge: true })
  }, [typing, activeConversation.id, currentUser.uid])

  function onTyping(text) {
    setText(text)
    setTyping(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setTyping(false), 500)
  }

  function toggleFile(file) {
    setFile(file)
  }

  async function sendMessage(text) {
    onSendMessage()
    setFile(null)
    setText('')
    setTyping(false)

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
      const fileRef = await storage.ref(`conversations/${activeConversation.id}/${msgId}`).put(file).then((snapshot) => snapshot.ref.getDownloadURL());
      await messageRef.set({ file: fileRef }, { merge: true })
    }
  }

  return (
    <React.Fragment>
      <ChatInput
        value={text}
        onSubmit={sendMessage}
        attachFile={setFile}
        required
        onChange={onTyping} />

      <Dialog
        open={Boolean(file)}
        onClose={() => toggleFile(null)}>
        <FileDialog
          file={file}
          handleClose={() => toggleFile(null)}
          onDone={sendMessage} />
      </Dialog>
    </React.Fragment>
  )
}
