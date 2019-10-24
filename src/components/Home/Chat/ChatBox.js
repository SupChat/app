import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveConversation } from '../../../state/actions/conversations'
import { db } from '../../../firebase'
import 'emoji-mart/css/emoji-mart.css'
import ChatInput from './ChatInput'
import _get from 'lodash/get'
import { store } from '../../../configureStore'

export default function ChatBox({ onSendMessage, attachFile }) {
  const [text, setText] = React.useState('')
  const [typing, setTyping] = React.useState(false)

  const currentUser = useSelector(store => store.auth.user)
  const activeConversation = useSelector(selectActiveConversation)
  const timeoutRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    const state = store.getState()
    const historyText = _get(state, `ui.chatInputHistory[${state.conversations.activeConversation}`)
    setText(historyText || '')
  }, [activeConversation.id])

  useEffect(() => {
    db
      .collection('conversations')
      .doc(activeConversation.id)
      .set({ members: { [currentUser.uid]: { typing } } }, { merge: true })
  }, [typing, activeConversation.id, currentUser.uid])

  function onTyping(text) {
    dispatch({ type: 'UPDATE_CHAT_INPUT_HISTORY', payload: { [activeConversation.id]: text } })
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
