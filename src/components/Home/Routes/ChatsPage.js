import React, { Fragment, useCallback, useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Conversations from '../Conversations/Conversations'
import { useSelector } from 'react-redux'
import SplitPane from 'react-split-pane'
import Chats from '../Chat/Chats'
import Profile from '../Profile'
import * as classnames from 'classnames'

const useStyles = makeStyles(theme => ({
  splitPane: {
    position: 'relative !important',

    '& .Resizer': {
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
      },
    },
    
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
    height: '100%',
  },
  chats: {
    height: '100%',
  },
}))

const ChatsPage = () => {
  const classes = useStyles()
  const [isDrag, setIsDrag] = useState(false)
  const showProfile = useSelector(store => store.ui.showProfile)
  const showUsers = useSelector(store => store.ui.showUsers)


  const onDragStarted = useCallback(() => setIsDrag(true), [])
  const onDragFinished = useCallback(() => setIsDrag(false), [])

  return (
    <Fragment>
      <SplitPane
        className={
          classnames(
            classes.splitPane, {
              [classes.onDrag]: isDrag,
              [classes.hidePane1]: !showUsers,
            })
        }
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

      {showProfile && <Profile conversationId={showProfile} />}
    </Fragment>
  )
}

export default ChatsPage 
