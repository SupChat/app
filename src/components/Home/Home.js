import React, { useEffect } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Conversations from './Conversations/Conversations'
import Chat from './Chat/Chat'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './Navbar/Navbar'
import { db } from '../../firebase'
import { setUsers } from '../../state/actions/users'
import SplitPane from 'react-split-pane'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    boxSizing: 'border-box',
  },
  hidePane1: {
    '& .Pane1': {
      display: 'none !important',
    },
    '& .Resizer': {
      display: 'none !important',
    },
  },
  drawer: {
    width: 360,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 360,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
  },
  chats: {
    height: '100%',
    alignItems: 'center',
  }
})

const Home = () => {
  const dispatch = useDispatch()
  const showUsers = useSelector(store => store.ui.showUsers)
  const classes = useStyles()
  const activeConversation = useSelector(store => store.conversations.activeConversation)

  useEffect(() => {
    return db.collection('users')
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map(doc => doc.data())
        dispatch(setUsers(users.reduce((prev, user) => ({ ...prev, [user.id]: user }), {})))
      })
  }, [dispatch])

  return (
    <div className={`${classes.root} ${showUsers ? '' : classes.hidePane1}`}>
      <SplitPane
        split="vertical"
        minSize={250}
        defaultSize={parseInt(localStorage.getItem('splitPos') || 350, 10)}
        onChange={size => localStorage.setItem('splitPos', size)}>
        <Conversations />
        <div className={classes.main}>
          <Navbar />

          <Grid container className={classes.chats}>
            {
              activeConversation.map((conversationId) => (
                <Chat
                  key={conversationId}
                  conversationId={conversationId} />
              ))
            }  
          </Grid>
        </div>
      </SplitPane>
    </div>
  )
}

export default Home
