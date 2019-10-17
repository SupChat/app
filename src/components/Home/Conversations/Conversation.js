import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { useDispatch, useSelector } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { db } from '../../../firebase'
import { setActiveConversation } from '../../../state/actions/conversations'
import _get from 'lodash/get'
import ConversationAvatar from './ConversationAvatar'
import { ConversationTitle } from './ConversationTitle'

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(155, 155, 157, 0.21)',
    },
    display: 'flex',
  },
  activeConversation: {
    background: 'rgba(155, 155, 157, 0.21)',
  },
  counter: {
    top: '50%',
    alignSelf: 'center',
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '24px',
    whiteSpace: 'nowrap',
  },
})

const Conversation = ({ data: conversation }) => {
  const [lastMessage, setLastMessage] = useState('')
  const classes = useStyles()
  const { id } = conversation
  const count = useSelector(store => store.conversations.unreadMessagesCount[id])
  const currentUser = useSelector(store => store.auth.user)
  const lastSeen = _get(conversation, `members[${currentUser.uid}].lastSeen`)
  const { uid: currentUserId } = currentUser
  const dispatch = useDispatch()
  const activeConversation = useSelector(store => store.conversations.activeConversation)

  function setActive() {
    dispatch(setActiveConversation(id))
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
          setLastMessage(snapshot.docs[0].data().text)
        }
      })

  }, [id, currentUserId])

  return (
    <ListItem
      onClick={setActive}
      className={`${classes.root} ${id === activeConversation ? classes.activeConversation : ''}`}
      alignItems="flex-start">

      <ListItemAvatar>
        <ConversationAvatar conversation={conversation} />
      </ListItemAvatar>

      <ListItemText
        primary={<ConversationTitle conversation={conversation} />}
        secondary={(
          <Typography className={classes.ellipsis}>{lastMessage}</Typography>
        )} />
      {
        Boolean(count) && (
          <Chip
            variant='default'
            color='primary'
            className={classes.counter}
            size="small"
            label={count} />
        )
      }

    </ListItem>
  )
}

export default Conversation
