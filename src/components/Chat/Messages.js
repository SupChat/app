import React, { useEffect, useRef, useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveConversation, setMessages } from '../../actions/conversations'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'
import _get from 'lodash/get'
import _last from 'lodash/last'
import _sortBy from 'lodash/sortBy'
import { db } from '../../firebase'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles({
  root: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  list: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: 0,
    position: 'relative',
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
})

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const Messages = () => {
  const listRef = useRef()
  const progressRef = useRef()

  const [isLoading, setIsLoading] = useState(false)
  const [scrollObject, setScrollObject] = useState({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 })
  const dispatch = useDispatch()
  const classes = useStyles()

  const conversationId = useSelector(store => store.conversations.activeConversation)
  const currentUserId = useSelector(store => store.auth.user.uid)
  const users = useSelector(store => store.users.users)
  const messagesObject = useSelector(store => store.conversations.messages[store.conversations.activeConversation]) || {}
  const messages = _sortBy(Object.values(messagesObject || {}), 'date') || []
  const shouldFetchMessages = messages.length < 10

  const lastMsg = _get(_last(messages), 'from') === currentUserId

  function setScrollObj() {
    const scrollTop = _get(listRef, 'current.scrollTop') || 0
    const scrollHeight = _get(listRef, 'current.scrollHeight') || 0
    const clientHeight = _get(listRef, 'current.clientHeight') || 0
    setScrollObject({ scrollTop, scrollHeight, clientHeight })
  }

  function updateLastSeen() {
    return db
      .collection('conversations')
      .doc(conversationId)
      .set({
        members: {
          [currentUserId]: {
            lastSeen: new Date(),
          },
        },
      }, { merge: true })
  }

  function onGetMessages(snapshot) {
    setIsLoading(false)
    updateLastSeen()
    setScrollObj()

    const messagesList = (snapshot.docs || []).map((doc) => doc.data())

    dispatch(setMessages({
      id: conversationId,
      messages: messagesList.reduce((prev, doc) => ({ ...prev, [doc.id]: doc }), {}),
    }))

  }

  useEffect(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollObject
    const onEnd = scrollHeight - scrollTop === clientHeight
    const onStart = listRef.current.scrollTop === 0

    if (onStart) {
      listRef.current.scrollTop = listRef.current.scrollHeight - (scrollHeight)
      setIsLoading(false)
    } else if (onEnd || lastMsg) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    return () => {
    }
  }, [messages.length])

  useEffect(() => {
    const messagesRef = db.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('date', 'desc')

    if (shouldFetchMessages) {
      messagesRef.limit(10).get().then(onGetMessages)
    }

    return messagesRef.limit(1).onSnapshot(onGetMessages)

  }, [conversationId, currentUserId, shouldFetchMessages, dispatch])

  function onScrollList(e) {
    if (e.currentTarget.scrollTop === 0 && messages.length) {
      setIsLoading(true)
      db.collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .orderBy('date', 'desc')
        .limit(10)
        .where('date', '<', _get(messages, '[0].date' || new Date()))
        .get()
        .then(onGetMessages)
        .catch(() => setIsLoading(false))
    }
  }

  return (
    <div className={classes.root}>
      {
        isLoading && (
          <div className={classes.progress}>
            <CircularProgress color="secondary" />
          </div>
        )
      }
      <List ref={listRef} className={classes.list} onScroll={onScrollList}>
        {
          messages.map((message) => (
            <ListItem key={message.id}>
              <ListItemAvatar>
                <Avatar src={users[message.from].photoURL} />
              </ListItemAvatar>
              <ListItemText
                dir="auto"
                primary={message.text}
                secondary={moment(message.date.toDate()).format('HH:mm:ss')} />
            </ListItem>
          ))
        }
      </List>
    </div>
  )
}

export default Messages
