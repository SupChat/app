import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      outline: '1px solid slategrey',
    },
  },
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}))

export default function BaseStyle({ children }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {children}
    </div>)
}