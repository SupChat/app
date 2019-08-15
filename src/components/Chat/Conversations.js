import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import { db } from '../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveConversation, setConversations } from '../../actions/conversations'
import Conversation from './Conversation'
import Divider from '@material-ui/core/Divider'
import Fab from '@material-ui/core/Fab'
import { isEmpty } from 'lodash'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import ChatIcon from '@material-ui/icons/Chat'
import Users from './Users'
import { setUsers } from '../../actions/users'
import _get from 'lodash/get'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: 360,
    backgroundColor: 'rgba(63, 81, 181, 0.05)',
    position: 'relative',
    boxSizing: 'border-box',
    boxShadow: '0px 0 2px 0px rgba(63, 81, 181, 0.6)',
  },
  add: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  inline: {
    display: 'inline',
  },
  list: {
    height: '100%',
    overflow: 'auto',
    boxSizing: 'border-box',
    padding: 0,
  }
}))

export default function Conversations() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const conversations = useSelector((store) => store.conversations.conversations)
  const [anchorEl, setAnchorEl] = useState(null)
  const users = useSelector(store => store.users.users)
  const currentUser = useSelector(store => store.auth.user)

  useEffect(() => {
    return db.collection('conversations')
      .where(`members.${currentUser.uid}.active`, '==', true)
      .onSnapshot((snapshot) => {
        const docsDictionary = snapshot.docs.reduce((prev, doc) => ({
          ...prev, [doc.id]: doc.data() }), {})
        dispatch(setConversations(docsDictionary))
      })
  }, [dispatch, currentUser])

  useEffect(() => {
    const unsubscribeUsers = db.collection('users')
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map(doc => doc.data())
        dispatch(setUsers(users.reduce((prev, user) => ({ ...prev, [user.id]: user }), {})))
      })
    return () => unsubscribeUsers()
  }, [dispatch])

  function toggleAddConversationPopper(e) {
    setAnchorEl(anchorEl ? null : e.currentTarget)
  }

  function findAvatar(conversationId) {
    const conversation = conversations[conversationId]
    const userId = Object.keys(_get(conversation, 'members') || {}).find((userId) => userId !== currentUser.uid)
    return _get(users, `[${userId}].photoURL`)
  }

  function findName(conversationId) {
    const conversation = conversations[conversationId]
    const userId = Object.keys(_get(conversation, 'members') || {}).find((userId) => userId !== currentUser.uid)
    return _get(users, `[${userId}].displayName`)
  }

  const activeConversation = useSelector(store => store.conversations.activeConversation)

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {
          isEmpty(Object.values(conversations)) ? (
            <p>No conversations.</p>
          ) : Object.values(conversations).map((conversation) => (
            <React.Fragment key={conversation.id}>
              <Conversation
                id={conversation.id}
                activeConversation={activeConversation === conversation.id}
                avatar={findAvatar(conversation.id)}
                name={findName(conversation.id)}
                subtext=""
                onClick={() => dispatch(setActiveConversation(conversation.id))}
              />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        }
      </List>

      <Fab
        className={classes.add}
        onClick={toggleAddConversationPopper}
        color='primary'>
        <ChatIcon />
      </Fab>

      <Popper
        placement='bottom-end'
        open={Boolean(anchorEl)}
        anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Users onDone={toggleAddConversationPopper} />
            </Paper>
          </Fade>
        )}
      </Popper>

    </div>
  )
}
