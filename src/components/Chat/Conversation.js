import React, { useEffect, useState } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { useSelector } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { db } from '../../firebase'

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(155, 155, 157, 0.21)'
    },
    display: 'flex',
  },
  activeConversation: {
    background: 'rgba(155, 155, 157, 0.21)'
  },
  counter: {
    top: '50%',
    alignSelf: 'center',
  }
}))

const Conversation = ({ id, avatar, activeConversation, name, subtext, onClick }) => {
  const classes = useStyles()
  const [count, setCount] = useState(0)
  const currentUser = useSelector(store => store.auth.user)
  const conversations = useSelector(store => store.conversations.conversations)
  const { [id]: conversation } = conversations
  const { lastSeen } = conversation.members[currentUser.uid]
  const { uid: currentUserId } = currentUser

  useEffect(() => {
    return db
      .collection('conversations')
      .doc(conversation.id)
      .collection('messages')
      .where('date', '>=', lastSeen || new Date(0))
      .onSnapshot((snapshot) => {
        const snapshotData = (snapshot.docs || []).map((doc) => doc.data())
        const count = snapshotData.reduce((count, message) => message.from === currentUserId ? count : count + 1, 0)
        setCount(count)
      })

  }, [id, lastSeen, currentUserId, conversation.id])

  return (
    <ListItem
      onClick={onClick}
      className={`${classes.root} ${activeConversation ? classes.activeConversation : ''}`}
      alignItems="flex-start">
      <ListItemAvatar>
        <Avatar src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary">
              {name}
            </Typography>
            {subtext}
          </React.Fragment>
        }
      />

      <Chip
        variant="outlined"
        className={classes.counter}
        size="small"
        label={count} />

    </ListItem>
  )
}

export default Conversation
