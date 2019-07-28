import React, { useEffect, useRef } from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useSelector } from 'react-redux'
import SendIcon from '@material-ui/icons/Send'
import TagFacesIcon from '@material-ui/icons/TagFaces'

import IconButton from '@material-ui/core/IconButton'
import uuid from 'uuid'
import { selectActiveConversation } from '../../actions/conversations'
import { db } from '../../firebase'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

export default function ChatBox() {
  const [text, setText] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const [showEmojis, setShowEmojis] = React.useState(false)

  const currentUser = useSelector(store => store.auth.user)
  const activeConversation = useSelector(selectActiveConversation)
  const timeoutRef = useRef()

  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      event.target.form.dispatchEvent(new Event('submit', { cancelable: true }))
      event.preventDefault()
    }
  }

  useEffect(() => {
    db
      .collection('conversations')
      .doc(activeConversation.id)
      .set({ members: { [currentUser.uid]: { typing } } }, { merge: true })
  }, [typing])

  function onTyping(e) {
    setText(e.target.value)
    setTyping(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setTyping(false), 500)
  }

  function sendMessage(e) {
    e.preventDefault()
    const msgId = uuid()
    setText('')
    setShowEmojis(false)
    setTyping(false)

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

  function addEmoji(emoji) {
    setText(`${text}${emoji.native}`)
  }

  function toggleShowEmojis() {
    setShowEmojis(!showEmojis)
  }

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={sendMessage}>
        <TextField
          variant="outlined"
          multiline
          fullWidth
          onChange={onTyping}
          value={text}
          onKeyPress={submitOnEnter}
          inputProps={{
            dir: 'auto',
          }}
          InputProps={{
            endAdornment: (
              <React.Fragment>
                {
                  showEmojis && (
                    <ClickAwayListener onClickAway={toggleShowEmojis}>
                      <Picker
                        style={{ position: 'absolute', bottom: '100%', right: 0 }}
                        onSelect={addEmoji}
                        showPreview={false}

                        showSkinTones={false} />
                    </ClickAwayListener>
                  )
                }
                <InputAdornment position="end">
                  <IconButton
                    type='button'
                    color={showEmojis ? 'primary' : 'default'}
                    onClick={toggleShowEmojis}>
                    <TagFacesIcon />
                  </IconButton>
                  <IconButton type='submit' disabled={!text}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              </React.Fragment>
            ),
          }}
        />
      </form>
    </div>
  )
}
