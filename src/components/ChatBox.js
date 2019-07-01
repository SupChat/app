import React from 'react'
import { db } from '../firebase'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useSelector } from 'react-redux'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import uuid from 'uuid'

export default function ChatBox() {
  const [text, setText] = React.useState('')
  const user = useSelector(store => store.auth.user)
  const activeConversation = useSelector(store => store.conversations.activeConversation)

  function sendMessage(e) {
    e.preventDefault()
    const msgId = uuid()
    setText('')

    db.collection('messages').doc(`${activeConversation}`).set({
      [msgId]: {
        id: msgId,
        text,
        from: user.uid,
        date: new Date(),
        read: false,
      }
    }, { merge: true })
  }

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={sendMessage}>
        <TextField
          variant="outlined"
          fullWidth
          onChange={(e) => setText(e.target.value)}
          value={text}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type='submit'>
                  <SendIcon></SendIcon>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </form>
    </div>
  )
}
