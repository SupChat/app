import React, { useCallback } from 'react'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import ConversationAvatar from '../Conversations/ConversationAvatar'
import { ConversationTitle } from '../Conversations/ConversationTitle'
import Typing from '../Conversations/Typing'
import { selectTypingUsername } from '../../../state/reducers/conversations'
import CloseIcon from '@material-ui/icons/Close'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import IconButton from '@material-ui/core/IconButton'
import { removeActiveConversation } from '../../../state/actions/conversations'
import AttachFileIcon from '@material-ui/icons/AttachFile'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: '0 15px',
    zIndex: 10,
    alignSelf: 'flex-start',
    background: theme.palette.background.paper,
    boxSizing: 'border-box',
    height: 61,
  },
  typography: {
    padding: 2,
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 5px',
    justifyContent: 'center',
    height: '100%',
  },
  avatar: {
    height: 50,
    width: 50,
    margin: '0 5px',
  },
  baseInfo: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  ss: {
    position: 'absolute',
    right: 40,
    top: 16,
  },
  mainTitle: {
    cursor: 'pointer',
  },
}))

export default function ChatHeader({ conversationId, attachFile, isLoading, onDragStart, isDraggable, showDetails }) {
  const classes = useStyles()

  const typingUsername = useSelector(selectTypingUsername(conversationId))
  const dispatch = useDispatch()

  const onChangeFileInput = useCallback((e) => {
    attachFile(e.target.files.length ? e.target.files.item(0) : null)
    e.target.value = ''
  }, [ attachFile ])

  const onClose = useCallback(() => {
    dispatch(removeActiveConversation(conversationId))
  }, [ conversationId, dispatch ])

  return (
    <Grid
      container
      className={classes.root}
      direction='row'
      alignItems='center'
      justify='space-between'>

      <div className={classes.baseInfo}>
        <ConversationAvatar id={conversationId} />

        <div className={classes.titles}>
          <Typography variant="subtitle1" className={classes.mainTitle} onClick={showDetails}>
            <ConversationTitle id={conversationId} />
          </Typography>

          {Boolean(typingUsername) && <Typing username={typingUsername} />}
        </div>
        {
          isLoading && (
            <div className={classes.progress}>
              <CircularProgress color="secondary" />
            </div>
          )
        }
      </div>
      <div className={classes.actions}>
        <React.Fragment>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            onChange={onChangeFileInput}
            type="file"
          />
          <label htmlFor="raised-button-file">
            <IconButton
              component="span"
              type='button'
              color='default'>
              <AttachFileIcon size='small' />
            </IconButton>
          </label>
        </React.Fragment>
        {
          isDraggable && (
            <React.Fragment>
              <IconButton size='small' onMouseDown={onDragStart}>
                <DragIndicatorIcon />
              </IconButton>

              <IconButton size='small' onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          )
        }
      </div>

    </Grid>
  )
}
