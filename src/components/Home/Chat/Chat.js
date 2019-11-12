import React, { useReducer, useRef, useState } from 'react'
import Messages from './Messages'
import ChatBox from './ChatBox'
import { makeStyles } from '@material-ui/core'
import ChatHeader from './ChatHeader'
import uuid from 'uuid'
import { db, storage } from '../../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import FileDialog from './FileDialog'
import { addActiveConversation } from '../../../state/actions/conversations'

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    height: '100%',
    boxShadow: '0 0 2px 0px #3f51b5',
    '&:focus-within': {
      boxShadow: '0 0 2px 1px #3f51b5',
      outline: 'none',
    },
  },
})

const initialState = { isLoading: false }

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case 'START_LOADING': {
      return { ...state, isLoading: true }
    }
    case 'STOP_LOADING': {
      return { ...state, isLoading: false }
    }
    default: {
      return state
    }
  }
}

const Chat = ({ conversationId }) => {
  const classes = useStyles()
  const listRef = useRef()
  const [state, dispatcher] = useReducer(chatReducer, initialState)

  const [isDragOn, setIsDragOn] = useState(false)
  const [file, setFile] = React.useState(null)
  const dispatch = useDispatch()
  const currentUserId = useSelector(store => store.auth.user.uid)
  const activeConversations = useSelector(store => store.conversations.activeConversations)

  async function onSendMessage(text) {
    listRef.current.scrollTop = listRef.current.scrollHeight
    setIsDragOn(false)
    setFile(null)

    const msgId = uuid()

    const messageRef = db
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .doc(msgId)

    await messageRef.set({
      id: msgId,
      text,
      ...(file ? { file: 'pending' } : {}),
      from: currentUserId,
      date: new Date(),
    })

    if (file) {
      const fileRef = await storage.ref(`conversations/${conversationId}/${msgId}`).put(file).then((snapshot) => snapshot.ref.getDownloadURL())
      await messageRef.set({ file: fileRef }, { merge: true })
    }
  }

  function onDragOver(e) {
    e.preventDefault()
  }

  function onDrop(e) {
    e.preventDefault()
    const conversationId = e.dataTransfer.getData('conversationId')
    if (activeConversations.includes(conversationId)) {
      dispatch(addActiveConversation(conversationId))
    }
    // console.log(e.dataTransfer.getData('conversationId'))
  }

  // function onDragLeave() {
  //   setIsDragOn(false)
  // }

  return (
    <div className={`${classes.root} chat`} onDragOver={onDragOver} onDrop={onDrop} tabIndex={-1}>
      <ChatHeader conversationId={conversationId} attachFile={setFile} isLoading={state.isLoading} />

      <Messages 
        conversationId={conversationId} 
        ref={listRef} 
        isDragOn={isDragOn} 
        dispatcher={dispatcher}
        isLoading={state.isLoading} />

      <ChatBox conversationId={conversationId} onSendMessage={onSendMessage} />

      <FileDialog
        file={file}
        onClose={() => setFile(null)}
        onDone={onSendMessage} />

      {/*{*/}
      {/*isDragOn && (*/}
      {/*<DropZone*/}
      {/*onDragLeave={onDragLeave}*/}
      {/*setFile={setFile} />*/}
      {/*)*/}
      {/*}*/}

    </div>
  )
}

export default Chat
