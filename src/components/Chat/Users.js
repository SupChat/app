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
  const [checked, setChecked] = React.useState([])
  const currentUser = useSelector(store => store.auth.user)
  const dispatch = useDispatch()
  const users = useSelector(store => store.users.users)
  const conversations = useSelector(store => store.conversations.conversations)
  const [searchText, setSearchText] = React.useState('')

  const handleToggle = value => () => {
    setChecked(checked.includes(value) ? checked.filter((check) => check !== value) : [...checked, value])
  }

  async function startConversation(e, users) {
    e.preventDefault()
    let id

    const existConversation = _get(Object.values(conversations).find((conversation) => (
      Object.values(conversation.members).length === (users.length + 1) &&
      users.every(user => Object.keys(conversation.members).includes(user.id))
    )), 'id')

    if (existConversation) {
      id = existConversation
    } else {
      id = uuid()
      await db.collection('conversations').doc(id).set({
        id,
        members: {
          ...users.reduce((prev, id) => {
            return {
              ...prev,
              [id]: {
                active: true,
                lastSeen: new Date(0),
              }
            }
          }, {}),
          [currentUser.uid]: {
            active: true,
            lastSeen: new Date(0)
          }
        }
      })
    }

    dispatch(setActiveConversation(id))
    onDone()
  }

  return (
    <React.Fragment>
      <form className={classes.topForm} onSubmit={(e) => startConversation(e, checked)}>
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
        {Object.values(users).filter(user => user.id !== currentUser.uid).map(({ id, displayName }) => {
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
                  onClick={(e) => startConversation(e, [id])}>
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
