import React from 'react'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import { selectActiveConversation } from '../../actions/conversations'
import { useSelector } from 'react-redux'
import _get from 'lodash/get'

const useStyles = makeStyles({
  root: {
    height: 64,
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  typography: {
    padding: 2,
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    height: 50,
    width: 50,
    margin: '0 20px 0 10px',
  }
})

export default function ChatHeader() {
  const classes = useStyles()
  const users = useSelector(store => store.users.users)
  const currentUser = useSelector(store => store.auth.user)
  const conversation = useSelector(selectActiveConversation)
  const members = _get(conversation, 'members') || {}
  const userId = Object.keys(members).find((userId) => userId !== currentUser.uid)
  const user = _get(users, userId)
  const avatar = _get(user, 'photoURL')
  const name = _get(user, 'displayName')
  const typing = _get(members, `${userId}.typing`)

  return (
    <Grid className={classes.root} container direction='row' alignItems='center'>
      <Avatar className={classes.avatar} src={avatar} />

      <div className={classes.titles}>
        <Typography variant="subtitle1">
          {name}
        </Typography>

        <Typography variant="subtitle2">
          {typing ? 'typing...' : ''}
        </Typography>
      </div>
    </Grid>
  )
}
