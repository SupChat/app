import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveConversation } from '../../actions/conversations'
import { db } from '../../firebase'
import 'emoji-mart/css/emoji-mart.css'
import ChatInput from './ChatInput'

export default function ChatBox({ onSendMessage, attachFile }) {
  const [text, setText] = React.useState('')
  const [typing, setTyping] = React.useState(false)

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

  function sendMessage(text) {
    onSendMessage(text)
    setText('')
    setTyping(false)
  }

  return (
    <ChatInput
      attachFile={attachFile}
      value={text}
      onSubmit={sendMessage}
      required
      onChange={onTyping} />
  )
}
