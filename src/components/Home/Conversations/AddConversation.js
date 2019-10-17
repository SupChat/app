import React, { useState } from 'react'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import Select from 'react-select'
import _get from 'lodash/get'
import uuid from 'uuid'
import { db } from '../../../firebase'
import { setActiveConversation } from '../../../state/actions/conversations'

const useStyles = makeStyles(theme => ({
  add: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  paper: {
    overflow: 'visible',
    width: 450,
  },
  content: {
    padding: '16px 30px',
    overflow: 'visible',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

function Option(props) {
  const { innerProps, innerRef } = props

  const classes = makeStyles({
    root: {},
  })()

  const users = useSelector(store => store.users.users)
  const user = users[props.data.value]
  const { displayName, email, photoURL } = user

  return (
    <div className={classes.root}
         ref={innerRef}
         {...innerProps}>
      <ListItem dense button>

        <ListItemAvatar>
          <Avatar src={photoURL} />
        </ListItemAvatar>

        <ListItemText
          secondary={email}
          primary={displayName} />
      </ListItem>
    </div>
  )
}

export default function AddConversation({ onClose }) {
  const classes = useStyles()
  const [selected, setSelected] = useState([])
  const users = useSelector(store => store.users.users)
  const usersOptions = Object.values(users).map(({ displayName, id }) => ({ value: id, label: displayName }))
  const conversations = useSelector(store => store.conversations.conversations)
  const currentUser = useSelector(store => store.auth.user)
  const dispatch = useDispatch()

  async function start(e) {
    e.preventDefault()
    let id

    const existConversation = _get(Object.values(conversations).find((conversation) => {
      return (
        Object.values(conversation.members).length === (selected.length + 1) &&
        selected.every(user => Object.keys(conversation.members).includes(user.value))
      )
    }), 'id')

    if (existConversation) {
      id = existConversation
    } else {
      id = uuid()
      await db.collection('conversations').doc(id).set({
        id,
        members: {
          ...selected.reduce((prev, { value: id }) => {
            return {
              ...prev,
              [id]: {
                active: true,
                lastSeen: new Date(0),
              },
            }
          }, {}),
          [currentUser.uid]: {
            active: true,
            lastSeen: new Date(0),
          },
        },
      })
    }

    dispatch(setActiveConversation(id))
    onClose()
  }

  return (
    <form onSubmit={start}>
      <DialogTitle disableTypography>
        <Typography variant="h6">New Conversation</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      < DialogContent dividers className={classes.content}>
        <Select
          autoFocus
          placeholder={'Find or start a conversation.'}
          styles={{
            // container: () => ({
            //   width: 300,
            // }),
          }}
          closeMenuOnSelect={false}
          components={{
            Option,
          }}
          value={selected}
          onChange={setSelected}
          options={usersOptions}
          isMulti>

        </Select>

      </DialogContent>

      <DialogActions>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit">Start</Button>
      </DialogActions>
    </form>
  )
}