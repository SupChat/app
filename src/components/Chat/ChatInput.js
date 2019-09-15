import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Emoji, Picker } from 'emoji-mart'
import { createTextHTML } from './EmujiText'
import ContentEditable from 'react-contenteditable'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import AttachFileIcon from '@material-ui/icons/AttachFile'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    color: 'rgba(0, 0, 0, 0.87)',
    cursor: 'text',
    display: 'inline-flex',
    fontSize: 17,
    boxSizing: 'border-box',
    alignItems: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.1875em',
    border: '1px solid #abb3ea',
    '&:focus-within': {
      borderColor: '#3f51b5',
    }
  },
  input: {
    whiteSpace: 'pre',
    outline: 'none',
    font: 'inherit',
    color: 'currentColor',
    width: '100%',
    border: 0,
    minHeight: 64,
    maxHeight: 300,
    overflowY: 'auto',
    overflowX: 'hidden',
    margin: 0,
    minWidth: 0,
    background: 'none',
    display: 'inline-block',
    padding: 20,
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    alignSelf: 'flex-end',
    padding: 8,
  },
})


export default function ChatInput({ value: text, onChange, onSubmit, attachFile, required }) {
  const [showEmojis, setShowEmojis] = React.useState(false)
  const [contentHtml, setContentHtml] = React.useState('')
  const [range, setRange] = React.useState(null)
  const formRef = useRef()
  const contentEditableRef = useRef()
  const classes = useStyles()

  function getCurrentRange() {
    return window.getSelection().getRangeAt(0).cloneRange()
  }

  function setCurrentRange(currentRange) {
    const cloneCurrentRange = currentRange.cloneRange()
    const selection = window.getSelection()
    currentRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(cloneCurrentRange)
  }

  useEffect(() => {
    const value = [...contentEditableRef.current.childNodes].map((e) => {
      if (e.nodeName === 'IMG') {
        return e.getAttribute('alt')
      } else {
        return e.nodeValue
      }
    }).join('')
    onChange(value)
  }, [contentHtml])

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
    const e = Emoji({
      html: true,
      set: 'google',
      emoji: emoji,
      skin: emoji.skin || 1,
      size: 21,
    }).replace(/span/g, 'img')

    const elem = document.createElement('div')
    elem.innerHTML = e
    elem.firstChild.setAttribute('alt', emoji.native)
    if (document.activeElement !== contentEditableRef.current) {
      contentEditableRef.current.focus()
      if (range) {
        setCurrentRange(range)
      }
    }
    document.execCommand('insertHTML', false, elem.innerHTML)
  }

  function onAttachFile(e) {
    attachFile(e.target.files.length ? e.target.files.item(0) : null)
    e.target.value = ''
  }

  function onChangeContentEditable(e) {
    setContentHtml(e.target.value)
    saveCurrentRange()
  }

  function onPaste(e) {
    e.preventDefault()
    const text = (e.originalEvent || e).clipboardData.getData('text/plain')
    const html = createTextHTML(text)
    document.execCommand('insertHTML', false, html)
  }

  function saveCurrentRange() {
    setRange(getCurrentRange())
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
      <div className={classes.actions}>
        {
          attachFile && (
            <React.Fragment>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                onChange={onAttachFile}
                type="file"
              />
              <label htmlFor="raised-button-file">
                <IconButton
                  component="span"
                  type='button'
                  color='default'>
                  <AttachFileIcon />
                </IconButton>
              </label>
            </React.Fragment>
          )
        }
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
