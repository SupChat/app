import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import React, { useCallback } from 'react'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemText from '@material-ui/core/ListItemText'
import EmojiText from './EmujiText'
import moment from 'moment'
import _get from 'lodash/get'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Typography from '@material-ui/core/Typography'
import * as classnames from 'classnames'
import { lighten } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(theme => ({
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    background: lighten(theme.palette.secondary.main, 0.9),
    display: 'flex',
    position: 'relative',
  },
  ListItemText: {
    whiteSpace: 'pre-line',
    background: theme.palette.background.paper,
    borderRadius: 4,
    padding: 10,
    boxShadow: `0 0 1px 0 ${theme.palette.primary.main}`,
    wordBreak: 'break-all',
    flex: 'none',
    maxWidth: 'calc(70% - 60px)',
    boxSizing: 'border-box',
    '&.friend': {
      background: theme.palette.background.paper,
      boxShadow: `0 0 1px 0 ${theme.palette.secondary.main}`,
    },
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
    color: theme.palette.primary.main,
  },
  linkDescriptor: {
    display: 'flex',
    width: '100%',
    margin: '5px 0',
    padding: 10,
    background: lighten(theme.palette.secondary.main, 0.95),
    boxSizing: 'border-box',
  },
  linkDescriptorText: {
    padding: 10,
  },
  linkDescriptorImage: {
    width: 80,
    height: '100%',
    alignSelf: 'center',
  },
}))

function MessagePrimary({ message, classes, onZoomIn }) {
  return (
    <div>
      {
        message.file && (
          message.file !== 'pending' ? (
            <div className={classes.imgContainer}>
              <ButtonBase onClick={onZoomIn}>
                <img className={classes.img} alt="" src={message.file} />
              </ButtonBase>
            </div>
          ) : <CircularProgress color="secondary" />
        )
      }
      {
        false && (
          <div className={classes.linkDescriptor}>
            <div className={classes.linkDescriptorText}>
              <Typography variant={'subtitle1'}>
                title of website
              </Typography>

              <Typography variant={'subtitle2'}>
                description of website description of website description of website
              </Typography>
            </div>

            <img
              className={classes.linkDescriptorImage}
              alt={'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'}
              src={'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'} />
          </div>
        )
      }


      <EmojiText text={message.text} />
    </div>
  )
}

export default function Message({ message, conversationId, setZoomImg }) {
  const classes = useStyles()
  const currentUserId = useSelector(store => store.auth.user.uid)
  const avatarPhotoURL = useSelector(store => _get(store, `users.users[${message.from}].photoURL`))
  const onZoomIn = useCallback(() => setZoomImg(message.file), [ setZoomImg, message.file ])

  return (
    <ListItem className={message.from === currentUserId ? classes.listItemSelf : classes.listItem}>
      <ListItemAvatar className={classes.avatar}>
        <Avatar className={classes.alignCenter} src={avatarPhotoURL} />
      </ListItemAvatar>

      <ListItemText
        dir="auto"
        className={classnames(classes.ListItemText, { friend: message.from !== currentUserId })}
        primary={<MessagePrimary message={message} classes={classes} onZoomIn={onZoomIn} />}
        secondary={
          <Typography className={classes.secondary}>
            {
              message.from === currentUserId && (
                <MessageReadIndicator
                  id={conversationId}
                  classes={classes}
                  date={message.date} />
              )
            }
            <Tooltip title={moment(message.date.toDate()).format('LLLL')}>
              <span>{moment(message.date.toDate()).format('HH:mm')}</span>
            </Tooltip>
          </Typography>
        } />
    </ListItem>
  )
}

function MessageReadIndicator({ classes, id, date }) {
  const members = useSelector(store => _get(store, `conversations.members[${id}]`))

  const isMessageRead = Object.values(members || {}).every(member => (
    (member.lastSeen ? member.lastSeen.toDate().getTime() : new Date(0).getTime()) >= date.toDate().getTime()
  ))

  return (
    <FontAwesomeIcon
      className={`${classes.faCheck} ${isMessageRead ? classes.faCheckDouble : ''}`}
      icon={isMessageRead ? faCheckDouble : faCheck} />
  )
}
