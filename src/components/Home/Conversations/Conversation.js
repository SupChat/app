import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { useDispatch, useSelector } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { firestore } from '../../../firebase'
import { setActiveConversations } from '../../../state/actions/conversations'
import _get from 'lodash/get'
import ConversationAvatar from './ConversationAvatar'
import { ConversationTitle } from './ConversationTitle'
import moment from 'moment'
import _keyBy from 'lodash/keyBy'
import { store } from '../../../configureStore'
import { selectTypingUsername } from '../../../state/reducers/conversations'
import Typing from './Typing'
import { fade } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWifi } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      background: fade(theme.palette.primary.main, 0.2),
    },
    display: 'flex',
  },
  activeConversation: {
    background: fade(theme.palette.primary.main, 0.2),
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
  connectedIcon: {
    alignSelf: 'center',
    margin: '0px 10px',
    color: 'lightgreen',
  }
}))

const Conversation = ({ id, count: unReadMessagesCount, message: lastMessage, dispatchLocal }) => {
  const classes = useStyles()
  const currentUserId = useSelector(store => store.auth.user.uid)
  const lastSeen = useSelector(store => _get(store, `conversations.members[${id}][${currentUserId}].lastSeen`))
  const activeConversations = useSelector(store => store.conversations.activeConversations)
  const typingUsername = useSelector(selectTypingUsername(id))
  const users = useSelector(store => store.users.users)
  const membersIds = useSelector(store => store.conversations.conversations[id].members)

  const dispatch = useDispatch()

  const timeoutRef = useRef()

  const setActive = useCallback(() => {
    dispatch(setActiveConversations([ id ]))
  }, [id, dispatch])

  const parsedDate = useCallback((date) => {
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
  }, [])

  useEffect(() => {
    if (lastSeen) {
      return firestore
        .collection('conversations')
        .doc(id)
        .collection('messages')
        .where('date', '>=', lastSeen)
        .onSnapshot((snapshot) => {
          const snapshotData = (snapshot.docs || []).map((doc) => doc.data())
          const count = snapshotData.reduce((count, message) => message.from === currentUserId ? count : count + 1, 0)
          dispatchLocal({ type: 'SET_CONVERSATION_COUNT', payload: { id, count } })
        })
    }
  }, [ dispatchLocal, id, lastSeen, currentUserId ])

  useEffect(() => {
    return firestore
      .collection('conversations')
      .doc(id)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(1)
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length) {
          const message = snapshot.docs[0].data()
          dispatchLocal({ type: 'SET_CONVERSATION_MESSAGE', payload: { id, message } })
        }
      })
  }, [ dispatchLocal, dispatch, id, currentUserId ])

  useEffect(() => {
    return firestore
      .collection('conversations')
      .doc(id)
      .collection('members')
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length) {
          const members = _keyBy(snapshot.docs.map(doc => doc.data()), 'id')
          dispatch({ type: 'SET_MEMBERS', payload: { id, members } })

          const userId = Object.entries(members)
            .filter(([ id ]) => id !== currentUserId)
            .reduce((result, [ id, member ]) => {
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
  }, [ dispatch, id, currentUserId ])

  const onDragStart = useCallback((e) => {
    e.dataTransfer.setData('conversationId', id)
  }, [id])

  const isOnline = useMemo(() => {
    return Object.keys(membersIds)
      .filter((id) => id !== currentUserId)
      .every((id) => _get(users, `${id}.status.state`) === 'online')
  }, [users, membersIds, currentUserId])

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

      {
        isOnline && (
          <FontAwesomeIcon
            className={classes.connectedIcon}
            icon={faWifi} />
        )
      }

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
        {Boolean(unReadMessagesCount) && (
          <Chip
            variant='default'
            color='primary'
            className={classes.counter}
            size="small"
            label={unReadMessagesCount} />
        )}
      </div>

    </ListItem>
  )
}

export default Conversation
