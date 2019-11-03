import React, { forwardRef, useEffect, useState } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoadingMessages, setMessages } from '../../../state/actions/conversations'
import List from '@material-ui/core/List'
import moment from 'moment'
import _get from 'lodash/get'
import _groupBy from 'lodash/groupBy'
import _sortBy from 'lodash/sortBy'
import { db } from '../../../firebase'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import CloseIcon from '@material-ui/icons/Close'
import Message from './Message'

const useStyles = makeStyles({
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
      color: '#3f51b5',
      background: 'rgba(255, 255, 255, 1)',
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
})

const Messages = ({ isDragOn }, listRef) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [zoomImg, setZoomImg] = useState(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [scrollTop, setScrollTop] = useState(false)
  const isLoadingMessages = useSelector(store => store.conversations.isLoadingMessages)
  const conversationId = useSelector(store => store.conversations.activeConversation)

  const currentUserId = useSelector(store => store.auth.user.uid)

  const messagesObject = useSelector(store => store.conversations.messages[store.conversations.activeConversation]) || {}
  const messages = _sortBy(Object.values(messagesObject || {}), 'date') || []
  const shouldFetchMessages = messages.length < 10

  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight

    if (shouldFetchMessages) {
      loadPrevious()
    }

    return db.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(1)
      .onSnapshot(onGetMessages)

  }, [conversationId, currentUserId, dispatch, shouldFetchMessages])

  function updateLastSeen() {
    return db
      .collection('conversations')
      .doc(conversationId)
      .collection('members')
      .doc(currentUserId)
      .set({
        active: true,
        id: currentUserId,
        lastSeen: new Date(),
      }, { merge: true })
  }

  function onGetMessages(snapshot) {
    updateLastSeen()

    const messagesList = (snapshot.docs || []).map((doc) => doc.data())

    dispatch(setMessages({
      id: conversationId,
      messages: messagesList.reduce((prev, doc) => ({ ...prev, [doc.id]: doc }), {}),
    }))

  }

  async function loadPrevious() {
    dispatch(setIsLoadingMessages(true))

    const snapshot = await db.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('date', 'desc')
      .limit(10)
      .where('date', '<', _get(messages, '[0].date') || new Date())
      .get()

    if (!snapshot.size) {
      setAllLoaded(true)
    }
    onGetMessages(snapshot)

    dispatch(setIsLoadingMessages(false))
  }

  async function onScrollList(e) {
    const isScrollingUp = scrollTop > e.currentTarget.scrollTop
    setScrollTop(e.currentTarget.scrollTop)

    if (e.currentTarget.scrollTop < 30 &&
      isScrollingUp &&
      messages.length &&
      !allLoaded &&
      !isLoadingMessages) {

      if (e.currentTarget.scrollTop === 0) {
        e.currentTarget.scrollTop = 1
      }

      await loadPrevious()
    }
  }

  const dayGroups = _groupBy(messages, function (message) {
    return moment(message.date.toDate()).startOf('day').format('DD/MM/YY')
  })

  return (
    <div className={`${classes.root} ${isDragOn ? classes.opacity : ''}`}>
      <List ref={listRef}
            className={classes.list}
            style={isLoadingMessages ? { overflow: 'hidden' } : {}}
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
