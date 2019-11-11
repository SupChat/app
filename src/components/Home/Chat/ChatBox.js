import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import 'emoji-mart/css/emoji-mart.css'
import ChatInput from './ChatInput'
import _get from 'lodash/get'
import { store } from '../../../configureStore'

export default function ChatBox({ onSendMessage, conversationId }) {
  const [text, setText] = React.useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const state = store.getState()
    const historyText = _get(state, `ui.chatInputHistory[${conversationId}`)
    setText(historyText || '')
  }, [conversationId])

  useEffect(() => {
    dispatch({ type: 'UPDATE_CHAT_INPUT_HISTORY', payload: { [conversationId]: text } })
  }, [conversationId, dispatch, text])

  function sendMessage(text) {
    onSendMessage(text)
    setText('')
  }

  return (
    <ChatInput
      conversationId={conversationId}
      onSubmit={sendMessage}
      required
      value={text}
      onChange={setText} />
  )
}
