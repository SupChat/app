import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons/faCommentDots'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { lighten } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  logo: {
    letterSpacing: -1.0,
    fontFamily: 'sans-serif',
    fontWeight: 100,
    color: lighten(theme.palette.primary.light, 0.7),
  },
  icon: {
    position: 'relative',
    transform: 'translate(-53px, -17px)',
    color: lighten(theme.palette.primary.light, 0.9),
  },
}))

export function Logo() {
  const classes = useStyles()

  return (
    <span className={classes.logo}>
    Sup Chat <FontAwesomeIcon className={classes.icon} icon={faCommentDots} />
  </span>
  )
}