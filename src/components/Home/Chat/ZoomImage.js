import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
import CloseIcon from '@material-ui/icons/Close'
import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  paper: {
    background: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    height: '100%',
    top: 0,
    zIndex: 1,
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

export default function ZoomImage({ src, onClose }) {
  const classes = useStyles()

  const stopPropagation = useCallback(e => e.stopPropagation(), [])

  return (
    <Drawer
      open={Boolean(src)}
      classes={{ paper: classes.paper, docked: classes.docked }}
      anchor='top'
      variant='persistent'
      onClose={onClose}>

      <div className={classes.zoomImg} onClick={onClose}>
        <Fab size='small' className={classes.zoomImgCloseIcon}>
          <CloseIcon />
        </Fab>
        <img alt="" src={src} onClick={stopPropagation} />
      </div>

    </Drawer>
  )
}