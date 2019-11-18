import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../../../state/actions/conversations'
import List from '@material-ui/core/List'
import moment from 'moment'
import _get from 'lodash/get'
import _groupBy from 'lodash/groupBy'
import { db } from '../../../firebase'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import CloseIcon from '@material-ui/icons/Close'
import Message from './Message'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  opacity: {
    opacity: 0.3,
  },
  list: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: 0,
    position: 'relative',
    scrollPadding: 10,
    '& li': {
      overflowAnchor: 'none',
    },
  },
  anchor: {
    overflowAnchor: 'auto',
    height: 1,
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    zIndex: 100,
  },
  day: {
    position: 'sticky',
    top: 60,
    fontSize: 16,
    textAlign: 'center',
    '& span': {
      color: theme.palette.text.secondary,
      background: theme.palette.background.default,
    },
    margin: '20px auto',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1,
  },
  paper: {
    background: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    height: '100%',
    top: 0,
    zIndex: 'initial',
    width: '100%',
  },
  docked: {
    height: '100%',
  },
  zoomImg: {
    height: '100%',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      display: 'block',
      height: '90%',
    },
  },
  zoomImgCloseIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
}))

const Messages = ({ conversationId, isDragOn, isLoading, dispatcher }, listRef) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [zoomImg, setZoomImg] = useState(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [scrollTop, setScrollTop] = useState(false)
  const currentUserId = useSelector(store => store.auth.user.uid)

  const messages = useSelector(store => store.conversations.messages[conversationId] || [])
  const shouldFetchMessages = messages.length < 10
  const lastDate = _get(messages, '[0].date')

  const updateLastSeen = useCallback(() => {
    return db
      .collection('conversations')
      .doc(conversationId)
      .collection('members')
      .doc(currentUserId.toString())
      .set({
        active: true,
        id: currentUserId,
        lastSeen: new Date(),
      }, { merge: true })
  }, [conversationId, currentUserId])

  const onGetMessages = useCallback(async (snapshot) => {
    dispatch(setMessages({
      id: conversationId,
      messages: (snapshot.docs || []).map((doc) => doc.data()),
    }))

    await updateLastSeen()
  }, [conversationId, updateLastSeen, dispatch])

  const loadPrevious = useCallback(async () => {
    dispatcher({ type: 'START_LOADING' })

    const snapshot = await db.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(10)
      .where('date', '<', lastDate || new Date())
      .get()

    if (snapshot.size < 10) {
      setAllLoaded(true)
    }

    onGetMessages(snapshot)

    dispatcher({ type: 'STOP_LOADING' })
  }, [lastDate, dispatcher, conversationId, onGetMessages])

  useEffect(() => {
    if (shouldFetchMessages) {
      loadPrevious()
    }    
  }, [loadPrevious, shouldFetchMessages])

  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight

    return db.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(1)
      .onSnapshot(onGetMessages)

  }, [
    listRef,
    onGetMessages,
    conversationId,
    dispatch,
  ])

  async function onScrollList(e) {
    const isScrollingUp = scrollTop > e.currentTarget.scrollTop
    setScrollTop(e.currentTarget.scrollTop)

    if (e.currentTarget.scrollTop < 30 &&
      isScrollingUp &&
      messages.length &&
      !allLoaded &&
      !isLoading) {

      if (e.currentTarget.scrollTop === 0) {
        e.currentTarget.scrollTop = 1
      }

      await loadPrevious()
    }
  }

  const dayGroups = _groupBy(messages, (message) => (
    moment(message.date.toDate()).startOf('day').format('DD/MM/YY')
  ))

  return (
    <div className={`${classes.root} ${isDragOn ? classes.opacity : ''}`}>
      <List ref={listRef}
            className={classes.list}
            style={isLoading ? { overflow: 'hidden' } : {}}
            onScroll={onScrollList}>
        {
          Object.entries(dayGroups).map(([day, messages]) => (
            <React.Fragment key={day}>
              <ListItem className={classes.day}> <span> {day} </span> </ListItem>
              {
                messages.map((message, index) => (
                  <Message
                    key={index}
                    message={message}
                    conversationId={conversationId}
                    setZoomImg={setZoomImg} />
                ))
              }
            </React.Fragment>
          ))
        }
        <div className={classes.anchor} />
      </List>
      <Drawer
        open={zoomImg}
        classes={{ paper: classes.paper, docked: classes.docked }}
        anchor='top'
        variant='persistent'
        onClose={() => setZoomImg(null)}>

        <div className={classes.zoomImg} onClick={() => setZoomImg(null)}>
          <Fab size='small' className={classes.zoomImgCloseIcon}>
            <CloseIcon />
          </Fab>
          <img alt="" src={zoomImg} onClick={(e) => e.stopPropagation()} />
        </div>

      </Drawer>
    </div>
  )
}

export default forwardRef(Messages)
