import React, { useEffect, useRef, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { useDispatch, useSelector } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { db } from '../../../firebase'
import { addActiveConversation } from '../../../state/actions/conversations'
import _get from 'lodash/get'
import ConversationAvatar from './ConversationAvatar'
import { ConversationTitle } from './ConversationTitle'
import moment from 'moment'
import _keyBy from 'lodash/keyBy'
import { store } from '../../../configureStore'
import { selectTypingUsername } from '../../../state/reducers/conversations'
import Typing from './Typing'

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.background.paper,
    },
    display: 'flex',
  },
  activeConversation: {
    background: theme.palette.background.paper,
  },
  counter: {
    top: '50%',
    margin: '1px 0',
    alignSelf: 'flex-end',
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '24px',
    whiteSpace: 'nowrap',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 6,
  },
}))

const Conversation = ({ id, dispatchLocal }) => {
  const [lastMessage, setLastMessage] = useState('')
  const classes = useStyles()
  const count = useSelector(store => store.conversations.unreadMessagesCount[id])
  const currentUser = useSelector(store => store.auth.user)
  const lastSeen = useSelector(store => _get(store, `conversations.members[${id}][${currentUser.uid}].lastSeen`))
  const { uid: currentUserId } = currentUser
  const dispatch = useDispatch()
  const activeConversations = useSelector(store => store.conversations.activeConversations)
  const typingUsername = useSelector(selectTypingUsername(id))

  const timeoutRef = useRef()

  function setActive() {
    dispatch(addActiveConversation(id))
  }

  function parsedDate(date) {
    const momDate = moment(date.toDate())
    const sameDay = momDate.isSame(new Date(), 'day')
    const sameYear = momDate.isSame(new Date(), 'year')
    if (sameDay) {
      return momDate.format('HH:mm')
    }
    if (sameYear) {
      return momDate.format('DD/MM')
    }
    return momDate.format('DD/MM/YY')
  }

  useEffect(() => {
    return db
      .collection('conversations')
      .doc(id)
      .collection('messages')
      .where('date', '>=', lastSeen || new Date(0))
      .onSnapshot((snapshot) => {
        const snapshotData = (snapshot.docs || []).map((doc) => doc.data())
        const count = snapshotData.reduce((count, message) => message.from === currentUserId ? count : count + 1, 0)
        dispatch({ type: 'SET_UNREAD_MESSAGES_COUNT', payload: { id, count } })
      })

  }, [dispatch, id, lastSeen, currentUserId])

  useEffect(() => {
    return db
      .collection('conversations')
      .doc(id)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(1)
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length) {
          setLastMessage(snapshot.docs[0].data())
          dispatchLocal({ type: 'UPDATE', payload: { [id]: snapshot.docs[0].data().date.toDate() } })
        }
      })
  }, [dispatchLocal, dispatch, id, currentUserId])


  useEffect(() => {
    return db
      .collection('conversations')
      .doc(id)
      .collection('members')
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length) {
          const members = _keyBy(snapshot.docs.map(doc => doc.data()), 'id')
          dispatch({ type: 'SET_MEMBERS', payload: { id, members } })

          const userId = Object.entries(members)
            .filter(([id]) => id !== currentUserId)
            .reduce((result, [id, member]) => {
              const dateA = member.typing ? member.typing.toDate().getTime() : 0
              const dateB = members[result] || 0
              return Math.max(dateA, dateB) === dateA ? id : result
            }, null)

          const typingTime = _get(members, `${userId}.typing`)

          if ((typingTime ? typingTime.toDate().getTime() : 0) + 600 > new Date().getTime()) {
            clearTimeout(timeoutRef.current)
            const username = _get(store.getState(), `users.users[${userId}].displayName`)
            dispatch({ type: 'SET_TYPING', payload: { id, data: { username } } })
            timeoutRef.current = setTimeout(() => {
              dispatch({ type: 'SET_TYPING', payload: { id, data: null } })
            }, 800)
          }
        }
      })
  }, [dispatch, id, currentUserId])

  function onDragStart(e) {
    e.dataTransfer.setData('conversationId', id)
  }

  return (
    <ListItem
      onDragStart={onDragStart}
      draggable
      onClick={setActive}
      className={`${classes.root} ${activeConversations.includes(id) ? classes.activeConversation : ''}`}
      alignItems="flex-start">

      <ListItemAvatar>
        <ConversationAvatar id={id} />
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography className={classes.ellipsis}>
            <ConversationTitle id={id} />
          </Typography>
        }
        secondary={
          typingUsername ? (
            <Typing username={typingUsername} />
          ) : (
            <Typography className={classes.ellipsis}>{lastMessage && lastMessage.text}</Typography>
          )
        } />
      <div className={classes.right}>
        {lastMessage && <span>{parsedDate(lastMessage.date)}</span>}
        {Boolean(count) && (
          <Chip
            variant='default'
            color='primary'
            className={classes.counter}
            size="small"
            label={count} />
        )}
      </div>

    </ListItem>
  )
}

export default Conversation
