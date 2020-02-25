import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../../../state/actions/conversations'
import List from '@material-ui/core/List'
import moment from 'moment'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'

import _groupBy from 'lodash/groupBy'
import { firestore } from '../../../firebase'
import Message from './Message'
import ZoomImage from './ZoomImage'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  opacity: {
    opacity: 0.3,
  },
  list: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: 0,
    position: 'relative',
    scrollPadding: '10px',
    '& li': {
      overflowAnchor: 'none',
    },
  },
  anchor: {
    overflowAnchor: 'auto',
    height: 1,
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    zIndex: 100,
  },
  day: {
    position: 'sticky',
    top: 60,
    fontSize: 16,
    textAlign: 'center',
    '& span': {
      color: theme.palette.text.secondary,
      background: theme.palette.background.default,
    },
    margin: '20px auto',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1,
  },
}))

const Messages = ({ conversationId, isDragOn, isLoading, dispatcher }, listRef) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [ zoomImg, setZoomImg ] = useState(null)
  const [ allLoaded, setAllLoaded ] = useState(false)
  const [ initialized, setInitialized ] = useState(false)

  const currentUserId = useSelector(store => store.auth.user.uid)
  const messages = useSelector(store => store.conversations.messages[conversationId] || [])

  const dayGroups = useMemo(() => (
    _groupBy(messages, (message) => (
      moment(message.date.toDate()).startOf('day').format('DD/MM/YY')
    ))
  ), [ messages ])
  const isEmptyMessages = useMemo(() => _isEmpty(messages), [ messages ])

  const scrollTop = useRef(0)
  const lastDate = useRef(new Date())

  lastDate.current = _get(messages, '[0].date')

  const updateLastSeen = useCallback(() => {
    return firestore
      .collection('conversations')
      .doc(conversationId)
      .collection('members')
      .doc(currentUserId.toString())
      .set({
        active: true,
        id: currentUserId,
        lastSeen: new Date(),
      }, { merge: true })
  }, [ conversationId, currentUserId ])

  const onGetMessages = useCallback(async (snapshot) => {
    dispatch(setMessages({
      id: conversationId,
      messages: (snapshot.docs || []).map((doc) => doc.data()),
    }))

    await updateLastSeen()
  }, [ conversationId, updateLastSeen, dispatch ])

  const loadMessages = useCallback(async () => {
    dispatcher({ type: 'START_LOADING' })

    const snapshot = await firestore.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(10)
      .where('date', '<', lastDate.current || new Date())
      .get()

    if (snapshot.size < 10) {
      setAllLoaded(true)
    }

    await onGetMessages(snapshot)

    dispatcher({ type: 'STOP_LOADING' })
  }, [ lastDate, dispatcher, conversationId, onGetMessages ])

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.')
        }
      })
    })
    observer.observe(listRef.current, { childList: true })
    return observer.disconnect;
  }, [ listRef ])

  useEffect(() => {
    if (initialized) {
      listRef.current.scrollTop = listRef.current.scrollHeight

      return firestore.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .orderBy('date', 'desc')
        .limit(1)
        .onSnapshot(onGetMessages)

    } else {
      loadMessages().then(() => setInitialized(true))
    }
  }, [ initialized, conversationId, loadMessages, listRef, onGetMessages ])

  const onScrollList = useCallback(async (e) => {
    if (e.currentTarget.scrollTop === 0) {
      e.currentTarget.scrollTop = 1
    }

    const needToLoadPrevious = (
      e.currentTarget.scrollTop < 30 &&
      scrollTop.current > e.currentTarget.scrollTop &&
      !isEmptyMessages &&
      !allLoaded &&
      !isLoading
    )

    scrollTop.current = e.currentTarget.scrollTop

    if (needToLoadPrevious) {
      await loadMessages()
    }
  }, [ isEmptyMessages, allLoaded, isLoading, loadMessages, scrollTop ])

  const onCloseZoomIn = useCallback(() => setZoomImg(null), [])

  return (
    <div className={`${classes.root} ${isDragOn ? classes.opacity : ''}`}>
      <List ref={listRef}
            className={classes.list}
            style={isLoading ? { overflow: 'hidden' } : {}}
            onScroll={onScrollList}>
        {
          Object.entries(dayGroups).map(([ day, messages ]) => (
            <React.Fragment key={day}>
              <ListItem className={classes.day}> <span> {day} </span> </ListItem>
              {
                messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    conversationId={conversationId}
                    setZoomImg={setZoomImg} />
                ))
              }
            </React.Fragment>
          ))
        }
        <div className={classes.anchor} />
      </List>

      <ZoomImage src={zoomImg} onClose={onCloseZoomIn} />
    </div>
  )
}

export default forwardRef(Messages)
