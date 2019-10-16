import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import { db } from '../../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setConversations } from '../../../state/actions/conversations'
import Conversation from './Conversation'
import Divider from '@material-ui/core/Divider'
import { isEmpty } from 'lodash'
import AddConversation from './AddConversation'
import { Chat } from '@material-ui/icons'
import Fab from '@material-ui/core/Fab'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles({
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
  },
  paper: {
    overflow: 'visible',
    width: 450,
  },
})

export default function Conversations() {
  const [open, setOpen] = useState(false)

  const classes = useStyles()
  const dispatch = useDispatch()
  const conversations = useSelector((store) => store.conversations.conversations)
  const currentUser = useSelector(store => store.auth.user)

  useEffect(() => {
    return db.collection('conversations')
      .where(`members.${currentUser.uid}.active`, '==', true)
      .onSnapshot((snapshot) => {
        const docsDictionary = snapshot.docs.reduce((prev, doc) => ({
          ...prev, [doc.id]: doc.data(),
        }), {})
        dispatch(setConversations(docsDictionary))
      })
  }, [dispatch, currentUser])

  function onCloseDialog() {
    setOpen(false)
  }


  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {
          isEmpty(Object.values(conversations)) ? (
            <p>No conversations.</p>
          ) : Object.values(conversations).map((conversation) => (
            <React.Fragment key={conversation.id}>
              <Conversation data={conversation} />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        }
      </List>

      <Fab
        className={classes.add}
        onClick={() => setOpen(true)}
        color='primary'>
        <Chat />
      </Fab>

      <Dialog
        open={open}
        classes={{
          paper: classes.paper,
        }}
        onClose={onCloseDialog}>

        <AddConversation onClose={onCloseDialog} />

      </Dialog>
    </div>
  )
}
