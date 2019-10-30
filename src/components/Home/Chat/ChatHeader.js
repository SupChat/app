import React, { useEffect, useRef, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
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
    height:'100%',
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
  const id = useSelector(store => store.conversations.activeConversation)

  const members = useSelector(store => store.conversations.members[id]) || {}
  const isLoadingMessages = useSelector(store => store.conversations.isLoadingMessages)
  const [typing, setTyping] = useState(false)
  const timeoutRef = useRef()

  useEffect(() => {
    const userId = Object.keys(members).find((userId) => userId !== currentUser.uid)
    const typingTime = _get(members, `${userId}.typing`)
    if ((typingTime ? typingTime.toDate().getTime() : 0) + 900 > new Date().getTime()) {
      setTyping(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setTyping(false)
      }, 500)
    }
  }, [members])

  return (
    <Grid className={classes.root} container direction='row' alignItems='center'>
      <ConversationAvatar id={id} />

      <div className={classes.titles}>
        <Typography variant="subtitle1">
          <ConversationTitle id={id} />
        </Typography>
        {
          (typing || true) && (
            <Typography className='typing'>
              typing<span>.</span><span>.</span><span>.</span>
            </Typography>
          )
        }
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
