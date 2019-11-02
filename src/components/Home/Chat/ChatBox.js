import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'emoji-mart/css/emoji-mart.css'
import ChatInput from './ChatInput'
import _get from 'lodash/get'
import { store } from '../../../configureStore'

export default function ChatBox({ onSendMessage, attachFile }) {
  const [text, setText] = React.useState('')

  const activeConversation = useSelector(store => store.conversations.activeConversation)
  const dispatch = useDispatch()

  useEffect(() => {
    const state = store.getState()
    const historyText = _get(state, `ui.chatInputHistory[${activeConversation}`)
    setText(historyText || '')
  }, [activeConversation])

  useEffect(() => {
    dispatch({ type: 'UPDATE_CHAT_INPUT_HISTORY', payload: { [activeConversation]: text } })
  }, [activeConversation, dispatch, text])

  function sendMessage(text) {
    onSendMessage(text)
    setText('')
  }

  return (
    <ChatInput
      attachFile={attachFile}
      onSubmit={sendMessage}
      required
      value={text}
      onChange={setText} />
  )
}
