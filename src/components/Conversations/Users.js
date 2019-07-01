import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import CommentIcon from '@material-ui/icons/Comment'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import uuid from 'uuid'
import { db } from '../../firebase'
import { setActiveConversation } from '../../actions/conversations'
import Button from '@material-ui/core/Button'
import _get from 'lodash/get'

const useStyles = makeStyles(theme => ({
  root: {
    width: 300,
    backgroundColor: theme.palette.background.paper,
  },
  topForm: {
    display: 'flex',
    justifyContent: 'center',
  }
}))

export default function Users({ onDone }) {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([0])

  const currentUser = useSelector(store => store.auth.user)

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }
  const dispatch = useDispatch()
  const users = useSelector(store => store.users.users)
  const conversations = useSelector(store => store.conversations.conversations)
  const [searchText, setSearchText] = React.useState('')

  async function startConversation(e) {
    e.preventDefault()
    let id

    const existConversation = _get(Object.values(conversations).find((conversation) => (
      conversation.userIds.length === (checked.length + 1) &&
      checked.every(user => conversation.userIds.includes(user))
    )), 'id')

    if (existConversation) {
      id = existConversation
    } else {
      id = uuid()
      await db.collection('conversations').doc(id).set({
        id,
        userIds: [
          ...checked,
          currentUser.uid
        ]
      })
    }

    dispatch(setActiveConversation(id))
    onDone()
  }

  function startConversationSingle(userId) {
    const id = uuid()
    db.collection('conversations').doc(id).set({
      id,
      userIds: [
        userId,
        currentUser.uid
      ]
    }).then(() => dispatch(setActiveConversation(id)))
    onDone()
  }

  return (
    <React.Fragment>
      <form className={classes.topForm} onSubmit={startConversation}>
        <TextField
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          disabled={!checked.length}
        />

        <Button type='submit'>
          START
        </Button>

      </form>
      <List className={classes.root}>
        {Object.values(users).map(({ id, displayName }) => {
          const labelId = `checkbox-list-label-${id}`
          return (
            <ListItem key={id} role={undefined} dense button onClick={handleToggle(id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${displayName}`} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Comments"
                  type='button'
                  onClick={() => startConversationSingle(id)}>
                  <CommentIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    </React.Fragment>
  )
}
