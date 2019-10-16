import React from 'react'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import { selectActiveConversation } from '../../../state/actions/conversations'
import { useSelector } from 'react-redux'
import _get from 'lodash/get'
import CircularProgress from '@material-ui/core/CircularProgress'
import ConversationAvatar from '../Conversations/ConversationAvatar'
import { ConversationTitle } from '../Conversations/ConversationTitle'

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: 10,
    zIndex: 10,
    alignSelf: 'flex-start',
    background: 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #e2e3e7',
  },
  typography: {
    padding: 2,
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 5px',
  },
  avatar: {
    height: 50,
    width: 50,
    margin: '0 5px',
  },
})

export default function ChatHeader() {
  const classes = useStyles()
  const currentUser = useSelector(store => store.auth.user)
  const conversation = useSelector(selectActiveConversation)
  const members = _get(conversation, 'members') || {}
  const userId = Object.keys(members).find((userId) => userId !== currentUser.uid)
  const typing = _get(members, `${userId}.typing`)
  const isLoadingMessages = useSelector(store => store.conversations.isLoadingMessages)

  return (
    <Grid className={classes.root} container direction='row' alignItems='center'>
      <ConversationAvatar conversation={conversation} />

      <div className={classes.titles}>
        <Typography variant="subtitle1">
          <ConversationTitle conversation={conversation} />
        </Typography>

        <Typography variant="subtitle2">
          {typing ? 'typing...' : ''}
        </Typography>
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
