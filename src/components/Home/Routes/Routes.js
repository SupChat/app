import { Route, Switch } from 'react-router'
import ChatsPage from './ChatsPage'
import User from './User'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: 'calc(100% - 64px)',
    width: '100%',
  },
}))

export default function Routes() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Switch>
        <Route path={'/'} exact component={ChatsPage} />
        <Route path={'/user'} component={User} />
      </Switch>
    </div>
  )
}