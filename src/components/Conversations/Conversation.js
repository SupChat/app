import React from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'


const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(155, 155, 157, 0.21)'
    }
  },
  activeConversation: {
    background: 'rgba(155, 155, 157, 0.21)'
  },
}))

const Conversation = ({ avatar, activeConversation, name, subtext, onClick }) => {
  const classes = useStyles()

  return (
    <ListItem
      onClick={onClick}
      className={`${classes.root} ${activeConversation ? classes.activeConversation : ''}`}
      alignItems="flex-start">
      <ListItemAvatar>
        <Avatar src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary">
              {name}
            </Typography>
            {subtext}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

export default Conversation
