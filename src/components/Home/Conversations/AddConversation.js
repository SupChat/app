import React, { useCallback, useMemo, useState } from 'react'
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
import _isEqual from 'lodash/isEqual'
import _uniq from 'lodash/uniq'

import uuid from 'uuid'
import { firestore } from '../../../firebase'
import { addActiveConversation } from '../../../state/actions/conversations'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'

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
  list: {
    height: 250,
    overflow: 'auto',
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
  chip: {
    margin: theme.spacing(1),
  },
}))

export default function AddConversation({ onClose }) {
  const classes = useStyles()
  const [ selected, setSelected ] = useState([])
  const [ input, setInput ] = useState('')

  const users = useSelector(store => store.users.users)
  const usersOptions = Object.values(users).map(({ displayName, id }) => ({ value: id, label: displayName }))
  const conversations = useSelector(store => store.conversations.conversations)
  const currentUser = useSelector(store => store.auth.user)
  const dispatch = useDispatch()

  const filteredUsers = useMemo(() => {
    const inputText = input.toLowerCase().trim()
    return usersOptions
      .filter(({ value }) => !selected.some((selected) => selected.value === value))
      .filter(({ label, value }) => {
        const user = _get(users, value)
        return (
          user.displayName.toLowerCase().trim().includes(inputText) ||
          user.email.toLowerCase().trim().includes(inputText)
        )
      })
  }, [ input, usersOptions, selected, users ])

  const start = useCallback(async (e) => {
    e.preventDefault()
    let id

    const existConversation = _get(Object.values(conversations).find((conversation) => {
      return (
        _isEqual(
          _uniq(Object.keys(conversation.members).sort()),
          _uniq([ ...selected.map(({ value }) => value), currentUser.uid ].sort()),
        )
      )
    }), 'id')

    if (existConversation) {
      id = existConversation
    } else {
      id = uuid()
      const batch = firestore.batch()

      const members = {
        ...selected.reduce((prev, { value: id }) => {
          return {
            ...prev,
            [id]: true,
          }
        }, {}),
        [currentUser.uid]: true,
      }

      await firestore.collection('conversations').doc(id).set({
        id,
        owner: currentUser.uid,
        members,
      })

      const membersCollection = firestore.collection('conversations').doc(id).collection('members')
      Object.keys(members).forEach((memberId) => {
        const memberRef = membersCollection.doc(memberId)
        batch.set(memberRef, { id: memberId, active: true, lastSeen: new Date(0) })
      })

      await batch.commit()
    }
    dispatch(addActiveConversation(id))
    onClose()
  }, [ conversations, dispatch, onClose, currentUser.uid, selected ])

  const onAddSelected = useCallback((e) => () => {
    setSelected(selected ? [ ...selected, e ] : [ e ])
  }, [ selected ])

  const onChangeSelected = useCallback((e) => setSelected(e), [])

  const MultiValueComponent = useMemo(() => {
    return ({ data }) => {
      const value = _get(data, 'value')
      const label = _get(data, 'label')

      const onDelete = () => {
        setSelected(selected.filter(({ value: val }) => val !== value))
      }

      return (
        <Chip
          onDelete={onDelete}
          avatar={<Avatar style={{ width: 30, height: 30 }} src={_get(users, `${data.value}.photoURL`)} />}
          label={label}
        />
      )
    }
  }, [ selected, users ])

  const onInputChange = useCallback((e) => setInput(e), [])

  return (
    <form onSubmit={start}>
      <DialogTitle disableTypography>
        <Typography variant="h6">New Conversation</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      < DialogContent dividers className={classes.content}>

        {/*<TextField*/}
        {/*id="standard-search"*/}
        {/*label="Search field"*/}
        {/*type="search"*/}
        {/*value={input}*/}
        {/*onChange={onInputChange}*/}
        {/*margin="normal"*/}
        {/*/>*/}

        <Select
          autoFocus
          placeholder={'Find or start a conversation.'}
          inputValue={input}
          onInputChange={onInputChange}
          value={selected}
          components={
            {
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              Menu: () => null,
              MultiValue: MultiValueComponent,
            }
          }
          onChange={onChangeSelected}
          hideSelectedOptions
          isMulti>
        </Select>

        <List className={classes.list}>
          {
            filteredUsers.map((data, index) => (
              <ListItem key={index} dense button onClick={onAddSelected(data)}>
                <ListItemAvatar>
                  <Avatar src={_get(users, `${data.value}.photoURL`)} />
                </ListItemAvatar>

                <ListItemText
                  secondary={_get(users, `${data.value}.email`)}
                  primary={_get(users, `${data.value}.displayName`)} />
              </ListItem>
            ))
          }
        </List>
      </DialogContent>

      <DialogActions>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit">Start</Button>
      </DialogActions>
    </form>
  )
}
