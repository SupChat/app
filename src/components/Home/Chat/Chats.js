import React from 'react'
import { useSelector } from 'react-redux'
import Chat from './Chat'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import * as classnames from 'classnames'

const useStyles = makeStyles({
  main: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  chats: {
    boxShadow: '0 0 2px 0px #3f51b5',
    width: '100%',
    height: 'calc(100% - 20px)',
    margin: '0 10px',
    alignSelf: 'center',
  },
  two: {
    boxShadow: 'none',
    '& div.chat': {
      '&:first-child': {
        marginRight: 5,
      },
      '&:last-child': {
        marginLeft: 5,
      }  
    }
  }
})

const Chats = () => {
  const activeConversations = useSelector(store => store.conversations.activeConversations)
  const classes = useStyles()

  return (
    <div className={classes.main}>

      <Grid container 
            alignItems='center' 
            className={classnames(classes.chats, {
              [classes.two]: activeConversations.length === 2
            })}>
        {
          activeConversations.map((conversationId) => (
            <Chat
              key={conversationId}
              conversationId={conversationId} />
          ))
        }
      </Grid>
    </div>
  )
}

export default Chats
