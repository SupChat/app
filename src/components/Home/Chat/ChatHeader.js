import React from 'react'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import ConversationAvatar from '../Conversations/ConversationAvatar'
import { ConversationTitle } from '../Conversations/ConversationTitle'
import Typing from '../Conversations/Typing'
import { selectTypingUsername } from '../../../state/reducers/conversations'

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: 10,
    zIndex: 10,
    alignSelf: 'flex-start',
    background: 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #e2e3e7',
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
})

export default function ChatHeader({ conversationId }) {
  const classes = useStyles()
  const isLoadingMessages = useSelector(store => store.conversations.isLoadingMessages)

  const typingUsername = useSelector(selectTypingUsername(conversationId))

  return (
    <Grid className={classes.root} container direction='row' alignItems='center'>
      <ConversationAvatar id={conversationId} />

      <div className={classes.titles}>
        <Typography variant="subtitle1">
          <ConversationTitle id={conversationId} />
        </Typography>

        {Boolean(typingUsername) && <Typing username={typingUsername} />}
      </div>
      {
        isLoadingMessages && (
          <div className={classes.progress}>
            <CircularProgress color="secondary" />
          </div>
        )
      }
    </Grid>
  )
}

/*
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
      <AttachFileIcon />
    </IconButton>
  </label>
</React.Fragment>
*/

/*

  function onChangeFileInput(e) {
    attachFile(e.target.files.length ? e.target.files.item(0) : null)
    e.target.value = ''
  }

 */