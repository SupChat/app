import React, { useCallback, useEffect, useState } from 'react'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useDispatch } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import ConversationAvatar from './Conversations/ConversationAvatar'
import Grid from '@material-ui/core/Grid'
import * as classnames from 'classnames'
import useTheme from '@material-ui/core/styles/useTheme'
import { ConversationTitle } from './Conversations/ConversationTitle'

const useStyles = makeStyles(theme => ({
  showProfile: {
    width: 0,
    display: 'flex',
    flexDirection: 'column',
    transition: `${theme.transitions.duration.standard}ms`,
    overflow: 'hidden',
  },
  mounted: {
    width: 300,
  },
  avatar: {
    width: 150,
    height: 150,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    boxSizing: 'border-box',
    flex: 1,
  },
}))

export default function Profile({ conversationId }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [ open, setOpen ] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    setTimeout(() => {
      setOpen(true)
    }, 0)
  }, [])


  const closeProfile = useCallback(() => {
    setOpen(false)
    setTimeout(() => {
      dispatch({ type: 'SHOW_PROFILE', payload: null })
    }, theme.transitions.duration.standard)
  }, [ dispatch, theme.transitions.duration.standard ])

  return (
    <div className={classnames(classes.showProfile, { [classes.mounted]: open })}>
      <div className={classes.header}>
        <IconButton onClick={closeProfile} color="secondary">
          <ChevronRightIcon />
        </IconButton>
      </div>

      <Divider />

      <div className={classes.main}>
        <Grid container justify="center" alignItems="center">
          <ConversationAvatar id={conversationId} classes={{ root: classes.avatar }} />
        </Grid>

        <div>
          <ConversationTitle id={conversationId} />
        </div>

      </div>
    </div>
  )
}