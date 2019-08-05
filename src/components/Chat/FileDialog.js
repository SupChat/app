import React, { use, useEffect, useRef, useState } from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import { DialogActions } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ChatTextFiled from './ChatTextFiled'
import { setMessages } from '../../actions/conversations'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  content: {
    height: 415,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    height: '80%',
  },
})

export default function FileDialog({ handleClose, onDone, file }) {
  const classes = useStyles()
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const reader = useRef(new FileReader())

  useEffect(() => {
    reader.current.onload = () => {
      setImage(reader.current.result)
    }
    reader.current.readAsDataURL(file)
  }, [])

  return (
    <React.Fragment>
      <DialogTitle>
        Upload Image
      </DialogTitle>

      <DialogContent dividers className={classes.content}>
        <img className={classes.img} src={image} />
        <ChatTextFiled value={text} onChange={setText} onSubmit={onDone} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onDone(text)} color="primary">
          Send
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}
