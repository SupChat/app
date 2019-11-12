import React, { useEffect, useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import { db } from '../../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setConversations } from '../../../state/actions/conversations'
import Conversation from './Conversation'
import Divider from '@material-ui/core/Divider'
import { isEmpty } from 'lodash'
import AddConversation from './AddConversation'
import ChatIcon from '@material-ui/icons/Chat'
import Fab from '@material-ui/core/Fab'
import Dialog from '@material-ui/core/Dialog'
import _get from 'lodash/get'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
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
    height: 'calc(100% - 20px)',
    margin: '0 10px',
    overflow: 'auto',
    boxSizing: 'border-box',
    padding: 0,
    boxShadow: '0 0 2px 0px #3f51b5',
    width: '100%',
  },
  paper: {
    overflow: 'visible',
    width: 450,
  },
})

const initalState = {
  conversations: {}
}

function reducer(state = initalState, action) {
  switch (action.type) {
    case 'UPDATE': {
      return { ...state, conversations: { ...state.conversations, ...action.payload } }
    }
    default: {
      return state
    }
  }
}

export default function Conversations() {
  const [open, setOpen] = useState(false)
  const [state, dispatchLocal] = useReducer(reducer)
  const classes = useStyles()
  const dispatch = useDispatch()
  const conversations = useSelector((store) => store.conversations.conversations)
  const currentUser = useSelector(store => store.auth.user)

  useEffect(() => {
    return db.collection('conversations')
      .where(`members.${currentUser.uid}`, '==', true)
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

  function sortConversationByDate(conA, conB) {
    const firstDate = _get(state, `conversations.${conA}`) ||  new Date(0) 
    const secondDate = _get(state, `conversations.${conB}`) ||  new Date(0)
    return firstDate >= secondDate ? -1 : 1
  }

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {
          isEmpty(Object.keys(conversations)) ? (
            <p>No conversations.</p>
          ) : Object.keys(conversations).sort(sortConversationByDate).map((id) => (
            <React.Fragment key={id}>
              <Conversation id={id} dispatchLocal={dispatchLocal} />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        }
      </List>

      <Fab
        className={classes.add}
        onClick={() => setOpen(true)}
        color='primary'>
        <ChatIcon />
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
