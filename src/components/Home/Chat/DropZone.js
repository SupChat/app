import React, { useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [ value ])

  return ref.current
}

const useStyles = makeStyles({
  root: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000000000,
    position: 'absolute',
    background: 'rgba(63, 81, 181, 0.05)',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typography: {
    border: '2px dotted #3f51b5',
    height: '30%',
    width: '60%',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f51b5',
  },
})

const DropZone = ({ onDragLeave, setFile }) => {
  function onDrop(acceptedFiles) {
    setFile(acceptedFiles[0])
  }

  const classes = useStyles()
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const prevIsDragActive = usePrevious(isDragActive)

  useEffect(() => {
    if (prevIsDragActive && !isDragActive) {
      onDragLeave()
    }
  }, [ isDragActive ])

  return (
    <div
      onDragLeave={onDragLeave}
      className={classes.root}
      {
        ...getRootProps({
          onClick: (e) => e.stopPropagation(),
        })
      }>
      <input {...getInputProps()} />
      <Typography className={classes.typography}>
        Drop the files here...
      </Typography>
    </div>
  )
}


export default DropZone

