import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Conversations from './Conversations/Conversations'
import Chat from './Chat'

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    boxSizing: 'border-box'
  }
})

const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Conversations />
      <Chat />
    </div>
  )
}

export default Home
