import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Conversations from './Chat/Conversations'
import Chat from './Chat/Chat'
import { useSelector } from 'react-redux'
import DropZone from './Chat/DropZone'

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    boxSizing: 'border-box'
  }
})

const Home = () => {
  const classes = useStyles()
  const activeConversation = useSelector(store => Boolean(store.conversations.activeConversation))

  return (
    <div className={classes.root}>
      <Conversations />
      {activeConversation && <Chat />}
    </div>
  )
}

export default Home
