import React from 'react'
import Messages from './Messages'
import ChatBox from './ChatBox'

const Chat = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <Messages />
    <ChatBox />
  </div>
)

export default Chat
