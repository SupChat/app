import React, { useCallback, useEffect, useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Conversations from './Conversations/Conversations'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './Navbar/Navbar'
import { db } from '../../firebase'
import { setUsers } from '../../state/actions/users'
import SplitPane from 'react-split-pane'
import classnames from 'classnames'
import Chats from './Chat/Chats'

const useStyles = makeStyles((theme) => {
  console.log(theme)
  return ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em'
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.primary.main,
        outline: '1px solid slategrey'
      },
      '.Resizer': {
        background: `${theme.palette.primary.dark}`,
        opacity: 1,
        width: 11,
        zIndex: 1,
        boxSizing: 'border-box',
        backgroundClip: 'padding-box',
        '&.vertical': {
          width: 11,
          margin: '0 -5px',
          borderLeft: '5px solid rgba(255, 255, 255, 0)',
          borderRight: '5px solid rgba(255, 255, 255, 0)',
          cursor: 'col-resize',
        }
      },
    },
    root: {
      position: 'relative',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      boxSizing: 'border-box',
      flexDirection: 'column',
    },
    splitPane: {
      position: 'relative !important',
      '& .Pane1': {
        transition: 'width .3s',
      },
    },
    onDrag: {
      '& .Pane1': {
        transition: 'none !important',
      },
    },
    hidePane1: {
      '& .Pane1': {
        width: '0 !important',
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
    },
  })
})

const Home = () => {
  const dispatch = useDispatch()
  const showUsers = useSelector(store => store.ui.showUsers)
  const classes = useStyles()
  const [isDrag, setIsDrag] = useState(false)

  useEffect(() => {
    return db.collection('users')
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map(doc => doc.data())
        dispatch(setUsers(users.reduce((prev, user) => ({ ...prev, [user.id]: user }), {})))
      })
  }, [dispatch])

  const onDragStarted = useCallback(() => setIsDrag(true), [])
  const onDragFinished = useCallback(() => setIsDrag(false), [])

  return (
    <div className={
      classnames(classes.root, {
        [classes.hidePane1]: !showUsers,
        [classes.onDrag]: isDrag,
      })
    }>
      <Navbar />

      <SplitPane
        className={classes.splitPane}
        style={{ transition: 'none !important' }}
        split="vertical"
        minSize={250}
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        defaultSize={parseInt(localStorage.getItem('splitPos') || 350, 10)}
        onChange={size => localStorage.setItem('splitPos', size.toString())}>

        <Conversations />
        <Chats />

      </SplitPane>
    </div>
  )
}

export default Home
