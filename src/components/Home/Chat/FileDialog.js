import React, { useCallback, useEffect, useRef, useState } from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import { DialogActions } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Dialog from '@material-ui/core/Dialog'
import ChatInput from './ChatInput'

const useStyles = makeStyles({
  content: {
    height: 415,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  img: {
    height: '80%',
  },
})

export default function FileDialog({ onClose, onDone, file }) {
  const classes = useStyles()
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const reader = useRef(new FileReader())

  useEffect(() => {
    if (file) {
      reader.current.onload = () => {
        setImage(reader.current.result)
      }
      reader.current.readAsDataURL(file)
    }
  }, [file])

  const onSend = useCallback(() => onDone(text), [onDone, text])

  return (
    <Dialog
      open={Boolean(file)}
      onClose={onClose}>

      <DialogTitle>
        Upload Image
      </DialogTitle>

      <DialogContent dividers className={classes.content}>
        <img className={classes.img} src={image} alt={image} />
        <ChatInput value={text} onChange={setText} onSubmit={onDone} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSend} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}
