import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import Messages from './Messages'
import { makeStyles } from '@material-ui/core'
import ChatHeader from './ChatHeader'
import uuid from 'uuid'
import { firestore, storage } from '../../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import FileDialog from './FileDialog'
import { addActiveConversation } from '../../../state/actions/conversations'
import { store } from '../../../configureStore'
import _get from 'lodash/get'
import ChatInput from './ChatInput'
import * as classnames from 'classnames'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    height: '100%',
    border: `1px solid ${theme.palette.background.paper}`,
    outline: 'none',
  },
  focusWithin: {
    '&:focus-within': {
      boxShadow: `0 0 2px 1px ${theme.palette.primary.main}`,
      zIndex: '10000000 !important',
    },
  },
}))

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

const Chat = ({ conversationId, onSwap, isDraggable }) => {
  const classes = useStyles()
  const listRef = useRef()
  const [ state, dispatcher ] = useReducer(chatReducer, initialState)

  const [ isDragOn, setIsDragOn ] = useState(false)
  const [ text, setText ] = React.useState('')
  const [ file, setFile ] = React.useState(null)

  const dispatch = useDispatch()
  const currentUserId = useSelector(store => store.auth.user.uid)
  const activeConversations = useSelector(store => store.ui.activeConversations)
  const elementRef = useRef()

  useEffect(() => {
    const state = store.getState()
    const historyText = _get(state, `ui.chatInputHistory[${conversationId}`)
    setText(historyText || '')
  }, [ conversationId ])

  useEffect(() => {
    dispatch({ type: 'UPDATE_CHAT_INPUT_HISTORY', payload: { [conversationId]: text } })
  }, [ conversationId, dispatch, text ])

  async function onSendMessage(text) {
    setText('')
    listRef.current.scrollTop = listRef.current.scrollHeight
    setIsDragOn(false)
    setFile(null)

    const msgId = uuid()

    const messageRef = firestore
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
  const mouseMove = useCallback((event) => {
    const { dragElement, dropElement, targetElementInitialBoundingBox, brothers } = dragData.current
    const { width: targetWidth, height: targetHeight, left: targetLeft, top: targetTop } = targetElementInitialBoundingBox
    const { left, top, width, height } = dragElement.getBoundingClientRect()
    if (dropElement) {
      dropElement.style.filter = null
    }
    dragElement.style.pointerEvents = 'none'
    const elements = document.elementsFromPoint(left + (width / 2), top + (height / 2))
    const newDropElement = elements.find((element) => brothers.includes(element))
    if (newDropElement) {
      dragElement.style.pointerEvents = null
      newDropElement.style.filter = 'blur(2px)'
    }
    dragData.current.dropElement = newDropElement
    dragElement.style.transition = null
    dragElement.style.zIndex = '2000'
    const translateX = event.clientX - targetLeft - (targetWidth / 2)
    const translateY = event.clientY - targetTop - (targetHeight / 2)
    dragElement.style.transform = `translate(${translateX}px, ${translateY}px)`
  }, [])

  const dragData = useRef()
  const DURATION = 500

  const mouseUp = useCallback(() => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
    const { dragElement, dropElement, dragElementInitialBoundingBox, brothers } = dragData.current
    const { left: initialLeft, top: initialTop } = dragElementInitialBoundingBox
    document.body.style.userSelect = null
    dragElement.style.transition = `transform ${DURATION}ms`
    setTimeout(() => {
      dragElement.style.pointerEvents = null
      dragElement.style.transition = null
      dragElement.style.transform = null
      dragElement.style.zIndex = null
      if (dropElement) {
        dropElement.style.transform = null
        dropElement.style.zIndex = null
        dropElement.style.transition = null

        const dragIndex = brothers.indexOf(dragElement)
        const dropIndex = brothers.indexOf(dropElement)
        onSwap(dragIndex, dropIndex)
      }
    }, DURATION)

    if (dropElement) {
      const { left: dropLeft, top: dropTop } = dropElement.getBoundingClientRect()
      dropElement.style.filter = null
      dropElement.style.transition = `transform ${DURATION}ms`
      dropElement.style.transform = `translate(${initialLeft - dropLeft}px, ${initialTop - dropTop}px)`
      dragElement.style.transform = `translate(${dropLeft - initialLeft}px, ${dropTop - initialTop}px)`
      dropElement.style.zIndex = '1999'
      dropElement.classList.remove('droppable')
    } else {
      dragElement.style.transform = `translate(0, 0)`
    }
    dragData.current = null
  }, [ onSwap, mouseMove ])

  const onDragStart = useCallback((e) => {
    const trigger = e.currentTarget
    const dragElement = elementRef.current
    document.body.style.userSelect = 'none'
    const dragElementInitialBoundingBox = dragElement.getBoundingClientRect()
    const targetElementInitialBoundingBox = trigger.getBoundingClientRect()
    const brothers = Array.from(elementRef.current.parentElement.children)

    dragData.current = { dragElement, dragElementInitialBoundingBox, targetElementInitialBoundingBox, brothers }
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }
  }, [ mouseMove, mouseUp ])

  const onCloseFileDialog = useCallback(() => {
    setFile(null)
  }, [])

  return (
    <div className={classnames(classes.root, 'chat', { [classes.focusWithin]: isDraggable })} onDragOver={onDragOver}
         onDrop={onDrop} tabIndex={-1} ref={elementRef}>
      <ChatHeader
        onDragStart={onDragStart}
        isDraggable={isDraggable}
        conversationId={conversationId}
        attachFile={setFile}
        isLoading={state.isLoading} />

      <Messages
        conversationId={conversationId}
        ref={listRef}
        isDragOn={isDragOn}
        dispatcher={dispatcher}
        isLoading={state.isLoading} />

      <ChatInput
        conversationId={conversationId}
        onSubmit={onSendMessage}
        required
        value={text}
        onChange={setText} />

      <FileDialog
        conversationId={conversationId}
        file={file}
        onClose={onCloseFileDialog}
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
