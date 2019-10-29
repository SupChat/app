import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../../firebase'
import 'emoji-mart/css/emoji-mart.css'
import ChatInput from './ChatInput'
import _get from 'lodash/get'
import { store } from '../../../configureStore'

export default function ChatBox({ onSendMessage, attachFile }) {
  const [text, setText] = React.useState('')

  const currentUser = useSelector(store => store.auth.user)
  const activeConversation = useSelector(store => store.conversations.activeConversation)
  const dispatch = useDispatch()

  useEffect(() => {
    const state = store.getState()
    const historyText = _get(state, `ui.chatInputHistory[${activeConversation}`)
    setText(historyText || '')
  }, [activeConversation])

  // useEffect(() => {
  //   db
  //     .collection('conversations')
  //     .doc(activeConversation)
  //     .collection('members')
  //     .doc(currentUser.uid)
  //     .set({ typing }, { merge: true })
  // }, [typing, activeConversation, currentUser.uid])

  function onChange(text) {
    dispatch({ type: 'UPDATE_CHAT_INPUT_HISTORY', payload: { [activeConversation]: text } })
    setText(text)

    db
      .collection('conversations')
      .doc(activeConversation)
      .collection('members')
      .doc(currentUser.uid)
      .set({ typing: new Date() }, { merge: true })
  }

  function sendMessage(text) {
    onSendMessage(text)
    setText('')
  }

  return (
    <ChatInput
      attachFile={attachFile}
      value={text}
      onSubmit={sendMessage}
      required
      onChange={onChange} />
  )
}
