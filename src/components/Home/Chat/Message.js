import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemText from '@material-ui/core/ListItemText'
import EmojiText from './EmujiText'
import moment from 'moment'
import _get from 'lodash/get'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  avatar: {
    alignSelf: 'baseline',
    maxWidth: 'initial',
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  img: {
    maxWidth: 190,
  },
  imgContainer: {
    display: 'flex',
    position: 'relative',
  },
  ListItemText: {
    whiteSpace: 'pre-line',
    background: 'rgba(63, 81, 181, 0.03)',
    borderRadius: 8,
    padding: 10,
    boxShadow: '0 0 2px 0px #3f51b5',
    wordBreak: 'break-all',
    flex: 'none',
    maxWidth: 'calc(70% - 60px)',
    boxSizing: 'border-box',
  },
  listItem: {
    flex: 'initial',
    flexDirection: 'row-reverse',
  },
  listItemSelf: {
    flex: 'initial',
    flexDirection: 'row',
  },
  secondary: {
    display: 'flex',
    direction: 'ltr',
    alignItems: 'center',
  },
  faCheck: {
    margin: '0 3px',
  },
  faCheckDouble: {
    color: '#3f51b5',
  },
})

export default function Message({ message, conversationId, setZoomImg }) {
  const classes = useStyles()
  const currentUserId = useSelector(store => store.auth.user.uid)
  const avatarPhotoURL = useSelector(store => _get(store, `users.users[${message.from}].photoURL`))

  return (
    <ListItem key={message.id} className={message.from === currentUserId ? classes.listItemSelf : classes.listItem}>
      <ListItemAvatar className={classes.avatar}>
        <Avatar className={classes.alignCenter} src={avatarPhotoURL} />
      </ListItemAvatar>

      {
        message.file && (
          message.file !== 'pending' ? (
            <div className={classes.imgContainer}>
              <Button onClick={() => setZoomImg(message.file)}>
                <img className={classes.img} alt="" src={message.file} />
              </Button>
            </div>
          ) : <CircularProgress color="secondary" />
        )
      }

      <ListItemText
        dir="auto"
        className={classes.ListItemText}
        primary={<EmojiText text={message.text} />}
        secondary={
          <Typography className={classes.secondary}>
            {
              message.from === currentUserId && (
                <MessageReadIndicator
                  conversationId={conversationId}
                  classes={classes}
                  date={message.date} />
              )
            }
            <span>{moment(message.date.toDate()).format('HH:mm:ss')}</span>
          </Typography>
        } />
    </ListItem>
  )
}

function MessageReadIndicator ({ classes, conversationId, date }) {
  const members = useSelector(store => _get(store, `conversations.conversations[${conversationId}].members`))

  const isMessageRead = Object.values(members).every(member => (
    member.lastSeen.toDate().getTime() >= date.toDate().getTime()
  ))

  return (
    <FontAwesomeIcon
      className={`${classes.faCheck} ${isMessageRead ? classes.faCheckDouble : ''}`}
      icon={isMessageRead ? faCheckDouble : faCheck} />
  )
}
