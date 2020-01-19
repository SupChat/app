import React, { useCallback, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Picker } from 'emoji-mart'
import { createTextHTML } from './EmujiText'
import ContentEditable from 'react-contenteditable'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import { db } from '../../../firebase'
import _throttle from 'lodash/throttle'
import { useSelector } from 'react-redux'
import { darken } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    position: 'relative',
    cursor: 'text',
    display: 'inline-flex',
    fontSize: 17,
    boxSizing: 'border-box',
    alignItems: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.1875em',
    background: theme.palette.background.default,
    '&:focus-within': {
      // background: fade(theme.palette.background.paper, 0.5),
      // borderColor: theme.palette.primary.dark,
      '& .child': {
        // borderColor: theme.palette.primary.dark,
      },
    },
  },
  input: {
    whiteSpace: 'pre-wrap',
    outline: 'none',
    font: 'inherit',
    width: '100%',
    border: 0,
    minHeight: 50,
    maxHeight: 300,
    overflowY: 'auto',
    overflowX: 'hidden',
    margin: 0,
    minWidth: 0,
    background: 'none',
    display: 'inline-block',
    padding: 20,
    boxSizing: 'border-box',
    '&::-webkit-scrollbar': {
      width: '6px!important',
      height: '6px!important',
    },
    '&::-webkit-scrollbar-track': {
      background: 'hsla(0,0%,100%,.08)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.2)',
    },
  },
  actions: {
    display: 'flex',
    alignSelf: 'flex-end',
    padding: 8,
    borderLeft: `1px solid ${darken(theme.palette.background.default, 0.1)}`,
  },
}))


export default function ChatInput({ value: text, onChange, onSubmit, required, conversationId }) {
  const [ showEmojis, setShowEmojis ] = React.useState(false)
  const [ contentHtml, setContentHtml ] = React.useState('')
  const [ range, setRange ] = React.useState(null)
  const formRef = useRef()
  const contentEditableRef = useRef()
  const classes = useStyles()
  const currentUserId = useSelector(store => store.auth.user.uid)

  useEffect(() => {
    const html = createTextHTML(text)
    setContentHtml(html)
  }, [ text ])

  useEffect(() => {
    const value = [ ...contentEditableRef.current.childNodes ].map((e) => {
      if (e.nodeName === 'IMG') {
        return e.getAttribute('alt')
      } else {
        return e.nodeValue
      }
    }).join('')
    onChange(value)
  }, [ onChange, contentHtml ])

  const onInput = useCallback(_throttle(() => {
    db
      .collection('conversations')
      .doc(conversationId)
      .collection('members')
      .doc(currentUserId.toString())
      .set({ typing: new Date() }, { merge: true })
  }, 200), [ conversationId, currentUserId ])

  function setCurrentRange(currentRange) {
    const cloneCurrentRange = currentRange.cloneRange()
    const selection = window.getSelection()
    currentRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(cloneCurrentRange)
  }

  function onKeyPress(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault()
      if (text) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true }))
      }
    }
  }

  function submitForm(e) {
    e.preventDefault()
    setShowEmojis(false)
    setContentHtml('')
    onSubmit(text)
  }

  function toggleShowEmojis() {
    setShowEmojis(!showEmojis)
  }

  function addEmoji(emoji) {
    const html = createTextHTML(emoji.native)

    if (document.activeElement !== contentEditableRef.current) {
      contentEditableRef.current.focus()
      if (range) {
        setCurrentRange(range)
      }
    }

    document.execCommand('insertHTML', false, html)
  }

  function onChangeContentEditable(e) {
    setContentHtml(e.target.value)
    saveCurrentRange()
    onInput()
  }

  function onPaste(e) {
    e.preventDefault()
    const text = (e.originalEvent || e).clipboardData.getData('text/plain')
    const html = createTextHTML(text)
    document.execCommand('insertHTML', false, html)
  }

  function saveCurrentRange() {
    try {
      const currentRange = window.getSelection().getRangeAt(0).cloneRange()
      setRange(currentRange)
    } catch (e) {
      setRange(null)
    }
  }

  return (
    <form
      tabIndex={0}
      noValidate
      autoComplete="off"
      disabled={!text}
      onSubmit={submitForm}
      onKeyPress={onKeyPress}
      ref={formRef}
      className={classes.root}>

      <ContentEditable
        innerRef={contentEditableRef}
        defaultValue={''}
        onPaste={onPaste}
        className={classes.input}
        html={contentHtml}

        onKeyDown={saveCurrentRange}
        onKeyUp={saveCurrentRange}
        onMouseUp={saveCurrentRange}
        onMouseDown={saveCurrentRange}

        onChange={onChangeContentEditable}
        dir='auto' />
      {
        showEmojis && (
          <ClickAwayListener onClickAway={toggleShowEmojis}>
            <Picker
              style={{ position: 'absolute', bottom: '100%', right: 0, zIndex: 1 }}
              set='google'
              onSelect={addEmoji}
              showPreview={false}
              showSkinTones={true} />
          </ClickAwayListener>
        )
      }

      <div className={`${classes.actions} child`}>

        <IconButton
          type='button'
          color={showEmojis ? 'primary' : 'default'}
          onClick={toggleShowEmojis}>
          <TagFacesIcon />
        </IconButton>
        <IconButton type='submit' disabled={required && !text}>
          <SendIcon />
        </IconButton>
      </div>
    </form>
  )
}
