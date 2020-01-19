import React, { useCallback, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Picker } from 'emoji-mart'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SendIcon from '@material-ui/icons/Send'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  input: {
    whiteSpace: 'pre',
  },
})


export default function ChatTextFiled({ value = '', onChange, onSubmit, attachFile, required }) {
  const classes = useStyles()
  const [ showEmojis, setShowEmojis ] = React.useState(false)
  const formRef = useRef()
  const textFieldRef = useRef()

  function submitForm(e) {
    e.preventDefault()
    setShowEmojis(false)
    onSubmit(value)
  }

  function toggleShowEmojis() {
    setShowEmojis(!showEmojis)
  }

  function addEmoji(emoji) {
    const endSelection = textFieldRef.current.selectionEnd
    const newValue = `${value.substr(0, endSelection)}${emoji.native}${value.substr(endSelection, value.length)}`
    onChange(newValue)
  }

  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true }))
      event.preventDefault()
    }
  }

  function onAttachFile(e) {
    attachFile(e.target.files.length ? e.target.files.item(0) : null)
    e.target.value = ''
  }

  const moreProps = { inputProps: { dir: 'auto', ref: textFieldRef } }
  const onTextFiledChange = useCallback((e) => onChange(e.target.value), [ onChange ])

  return (
    <div className={classes.root}>
      <form noValidate autoComplete="off" onSubmit={submitForm} ref={formRef}>
        <TextField
          variant="outlined"
          multiline
          autoFocus
          fullWidth
          onChange={onTextFiledChange}
          value={value}
          onKeyPress={submitOnEnter}
          InputProps={{
            endAdornment: (
              <React.Fragment>
                {
                  showEmojis && (
                    <ClickAwayListener onClickAway={toggleShowEmojis}>
                      <Picker
                        style={{ position: 'absolute', bottom: '100%', right: 0, zIndex: 1 }}
                        set='google'
                        onSelect={addEmoji}
                        showPreview={false}

                        showSkinTones={false} />
                    </ClickAwayListener>
                  )
                }
                <InputAdornment position="end">
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
                  <IconButton type='submit' disabled={required && !value}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              </React.Fragment>
            ),
          }}
          {...moreProps}
        />
      </form>
    </div>
  )
}
