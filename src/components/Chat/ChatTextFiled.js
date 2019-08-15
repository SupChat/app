import React from 'react'
import { Picker } from 'emoji-mart'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SendIcon from '@material-ui/icons/Send'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import TextField from '@material-ui/core/TextField'

export default function ChatTextFiled({ value, onChange, onSubmit, attachFile, required }) {
  const [showEmojis, setShowEmojis] = React.useState(false)

  function submitForm(e) {
    e.preventDefault()
    setShowEmojis(false)
    onSubmit(value)
  }

  function toggleShowEmojis() {
    setShowEmojis(!showEmojis)
  }

  function addEmoji(emoji) {
    onChange(`${value}${emoji.native}`)
  }

  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      event.target.form.dispatchEvent(new Event('submit', { cancelable: true }))
      event.preventDefault()
    }
  }

  function onAttachFile(e) {
    attachFile(e.target.files.length ? e.target.files.item(0) : null)
    e.target.value = ''
  }

  const moreProps = { inputProps: { dir: 'auto' } }

  return (
    <div style={{ width: '100%' }}>
      <form noValidate autoComplete="off" onSubmit={submitForm}>
        <TextField
          variant="outlined"
          multiline
          autoFocus
          fullWidth
          onChange={(e) => onChange(e.target.value)}
          value={value}
          onKeyPress={submitOnEnter}
          InputProps={{
            dir: 'auto',
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
