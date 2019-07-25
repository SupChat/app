import React, { useEffect, useRef } from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useSelector } from 'react-redux'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import uuid from 'uuid'
import { selectActiveConversation } from '../../actions/conversations'
import { db } from '../../firebase'

export default function ChatBox() {
  const [text, setText] = React.useState('')
  const [typings, setTypings] = React.useState(false)

  const currentUser = useSelector(store => store.auth.user)
  const activeConversation = useSelector(selectActiveConversation)
  const timeoutRef = useRef()

  useEffect(() => {
    db
      .collection('conversations')
      .doc(activeConversation.id)
      .set({ members: { [currentUser.uid]: { typings } } }, { merge: true })
  }, [typings])

  function onTypings(e) {
    setText(e.target.value)
    setTypings(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setTypings(false), 500)
  }

  function sendMessage(e) {
    e.preventDefault()
    const msgId = uuid()
    setText('')

    db
      .collection('conversations')
      .doc(activeConversation.id)
      .collection('messages')
      .doc(msgId)
      .set({
        id: msgId,
        text,
        from: currentUser.uid,
        date: new Date(),
        read: [],
      })
  }

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={sendMessage}>
        <TextField
          variant="outlined"
          fullWidth
          onChange={onTypings}
          value={text}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type='submit'>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </div>
  )
}
