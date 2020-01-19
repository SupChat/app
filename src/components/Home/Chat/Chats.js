import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Chat from './Chat'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import * as classnames from 'classnames'
import { setActiveConversations } from '../../../state/actions/conversations'
import { darken } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  chats: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    background: darken(theme.palette.background.default, 0.05),
  },
  zero: {
    // boxShadow: `0 0 2px 0px ${theme.palette.primary.main}`,
  },
  one: {},
  two: {
    boxShadow: 'none',
    '& div.chat': {
      position: 'absolute',
      height: '100%',
      '&:first-child': {
        top: 0,
        left: 0,
        width: 'calc(50% - 5px)',
      },
      '&:last-child': {
        top: 0,
        right: 0,
        width: 'calc(50% - 5px)',
      },
    },
  },
  three: {
    boxShadow: 'none',
    '& div.chat': {
      position: 'absolute',
      '&:nth-child(1)': {
        top: 0,
        left: 0,
        height: '50%',
        width: 'calc(50% - 5px)',
      },
      '&:nth-child(2)': {
        top: 0,
        right: 0,
        height: '50%',
        width: 'calc(50% - 5px)',
      },
      '&:nth-child(3)': {
        bottom: 0,
        left: 0,
        height: 'calc(50% - 10px)',
        width: '100%',
      },
    },
  },
}))

const Chats = () => {
  const activeConversations = useSelector(store => store.conversations.activeConversations)
  const classes = useStyles()
  const dispatch = useDispatch()

  const onSwap = useCallback((dragIndex, dropIndex) => {
    const cloneList = [ ...activeConversations ]
    cloneList[dragIndex] = activeConversations[dropIndex]
    cloneList[dropIndex] = activeConversations[dragIndex]
    dispatch(setActiveConversations(cloneList))
  }, [ dispatch, activeConversations ])

  const isDraggable = activeConversations.length > 1

  return (
    <div className={classes.main}>

      <Grid container
            alignItems='center'
            className={classnames(classes.chats, {
              [classes.zero]: activeConversations.length === 0,
              [classes.one]: activeConversations.length === 1,
              [classes.two]: activeConversations.length === 2,
              [classes.three]: activeConversations.length === 3,
            })}>
        {
          activeConversations.map((conversationId) => (
            <Chat
              isDraggable={isDraggable}
              onSwap={activeConversations.length > 1 ? onSwap : null}
              key={conversationId}
              conversationId={conversationId} />
          ))
        }
      </Grid>
    </div>
  )
}

export default Chats
