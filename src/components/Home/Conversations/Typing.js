import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  typing: {
    '& span': {
      fontSize: 'large',
      animationName: 'blink',
      animationDuration: '1.4s',
      animationIterationCount: 'infinite',
      animationFillMode: 'both',
      '&:nth-child(2)': {
        animationDelay: '.2s',
      },
      '&:nth-child(3)': {
        animationDelay: '.4s',
      },
    },
  },
})

const Typing = ({ username }) => {
  const classes = useStyles()

  return (
    <span className={classes.typing}>
      {username} typing<span>.</span><span>.</span><span>.</span>
    </span>
  )
}

export default Typing