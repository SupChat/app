import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import { firestore } from '../../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setConversations } from '../../../state/actions/conversations'
import Conversation from './Conversation'
import Divider from '@material-ui/core/Divider'
import { isEmpty } from 'lodash'
import AddConversation from './AddConversation'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import ChatIcon from '@material-ui/icons/Chat'
import Fab from '@material-ui/core/Fab'
import Dialog from '@material-ui/core/Dialog'
import _get from 'lodash/get'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
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
    overflow: 'auto',
    boxSizing: 'border-box',
    padding: 0,
    // boxShadow: `0 0 2px 0px ${theme.palette.primary.dark}`,
    width: '100%',
  },
  paper: {
    overflow: 'visible',
    width: 600,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    width: 180,
    marginLeft: 10,
  },
}))

const initialState = {
  searchInput: '',
  messages: {},
  counts: {},
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CONVERSATION_MESSAGE': {
      const { id, message } = action.payload
      return { ...state, messages: { ...state.messages, [id]: message } }
    }

    case 'SET_CONVERSATION_COUNT': {
      const { id, count } = action.payload
      return { ...state, counts: { ...state.counts, [id]: count } }
    }

    default: {
      return state
    }
  }
}

export default function Conversations() {
  const [ open, setOpen ] = useState(false)

  const [ state, dispatchLocal ] = useReducer(reducer, initialState)
  const classes = useStyles()
  const dispatch = useDispatch()
  const conversations = useSelector((store) => store.conversations.conversations)
  const currentUserId = useSelector(store => store.auth.user.uid)
  const users = useSelector(store => store.users.users)
  const conversationsSearchInput = useSelector(store => store.ui.conversationsSearchInput);

  useEffect(() => {
    const calcCounts = Object.values(state.counts).reduce((prev, current) => prev + current, 0)
    document.title = `Sup Chat ${calcCounts ? `(${calcCounts})` : ''}`
  }, [ state.counts ])

  const conversationsIds = useMemo(() => {
    return Object.entries(conversations)
      .filter(([ id, conversation ]) => {
        const search = conversationsSearchInput.trim().toLowerCase()
        const messageText = (_get(state.messages, `${id}.text`) || '').trim().toLowerCase()

        if (messageText.includes(search)) {
          return true
        }

        if (
          Object.keys(conversation.members)
            .map((memberId) => users[memberId])
            .filter(Boolean)
            .some(({ displayName, email }) => (
              displayName.trim().toLowerCase().includes(search) ||
              email.trim().toLowerCase().includes(search)
            ))
        ) {
          return true
        }

        return false
      })
      .sort(([ idA ], [ idB ]) => {
        const firstDate = _get(state.messages, `${idA}.date`) ? _get(state.messages, `${idA}.date`).toDate() : new Date(0)
        const secondDate = _get(state.messages, `${idB}.date`) ? _get(state.messages, `${idB}.date`).toDate() : new Date(0)
        return firstDate >= secondDate ? -1 : 1
      })
      .map(([ id ]) => id)
  }, [ conversations, conversationsSearchInput, state.messages, users ])

  useEffect(() => {
    return firestore.collection('conversations')
      .where(`members.${currentUserId}`, '==', true)
      .onSnapshot((snapshot) => {
        const docsDictionary = snapshot.docs.reduce((prev, doc) => ({
          ...prev, [doc.id]: doc.data(),
        }), {})
        dispatch(setConversations(docsDictionary))
      })
  }, [ dispatch, currentUserId ])

  const onOpenDialog = useCallback(() => setOpen(true), [])
  const onCloseDialog = useCallback(() => setOpen(false), [])

  const toggleShown = useCallback(() => dispatch({ type: 'TOGGLE_SHOW_USERS' }), [ dispatch ])

  const onChangeInput = useCallback((e) => (
    dispatch({
      type: 'SET_CONVERSIONS_SEARCH_INPUT',
      payload: e.target.value,
    })
  ), [ dispatch ])

  return (
    <div className={classes.root}>
      <div className={classes.header}>

        <div>
          <FormControl className={classes.searchInput}>
            <TextField
              color="secondary"
              value={conversationsSearchInput}
              onChange={onChangeInput}
              fullWidth
              label="Search"
              type="search"
              variant="standard" />
          </FormControl>
        </div>

        <IconButton onClick={toggleShown} color="secondary">
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />

      <List className={classes.list}>
        {
          isEmpty(conversationsIds) ? (
            <p> No conversations. </p>
          ) : conversationsIds.map((id) => (
            <React.Fragment key={id}>
              <Conversation
                id={id}
                message={state.messages[id]}
                count={state.counts[id]}
                dispatchLocal={dispatchLocal} />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        }
      </List>

      <Fab
        className={classes.add}
        onClick={onOpenDialog}
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
