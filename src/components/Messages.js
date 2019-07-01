import React, { useEffect, useRef } from 'react'
import { db } from '../firebase'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../actions/messages'
import List from '@material-ui/core/List'
import _sortBy from 'lodash/sortBy'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'
import _last from 'lodash/last'
import _get from 'lodash/get'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    overflow: 'auto',
  },
}))

const Messages = () => {
  const dispatch = useDispatch()
  const activeConversation = useSelector(store => store.conversations.activeConversation)
  const classes = useStyles()
  const messages = useSelector(store => store.messages.messages)
  const currentUser = useSelector(store => store.auth.user)
  const listRef = useRef()
  const users = useSelector(store => store.users.users)

  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [])

  useEffect(() => {
    let unSubscribe

    if (activeConversation) {
      unSubscribe = db.collection('messages').doc(activeConversation).onSnapshot((snapshot) => {
        const messagesList = Object.values(snapshot.data() || {})
        const messagesSorted = _sortBy(messagesList, 'date')
        dispatch(setMessages(messagesSorted))
      })
    }

    return () => {
      if (unSubscribe) {
        unSubscribe()
        console.log('unSubscribe')
      }
    }

  }, [activeConversation, dispatch])

  useEffect(() => {
    console.log(messages)
    const lastmsg = _get(_last(messages), 'from')
    const lastChild = listRef.current.querySelector('li:last-child')
    const currentUserLastMsg = lastmsg === currentUser.uid
    const onscrollEnd = lastmsg === listRef.current.scrollHeight - listRef.current.scrollTop - (lastChild && lastChild.clientHeight || 0) === listRef.current.clientHeight
    if (currentUserLastMsg || onscrollEnd) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])


  return (
    <List ref={listRef} className={classes.root}>
      {
        messages.map((message) => (

          <ListItem key={message.id}>
            <ListItemAvatar>
              <Avatar src={users[message.from].photoURL} />
            </ListItemAvatar>
            <ListItemText primary={message.text} secondary={moment(message.date.toDate()).format('HH:mm:ss')} />
          </ListItem>
        ))
      }
    </List>
  )
}

export default Messages
