import React from 'react'
import _get from 'lodash/get'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'

export default function ConversationAvatar({ conversation }) {
  const users = useSelector(store => store.users.users)
  const currentUserId = useSelector(store => store.auth.user.uid)

  const membersList = Object.keys(conversation.members || {})
    .filter((userId) => userId !== currentUserId)

  return membersList.length === 1 ? (
    <Avatar src={_get(users, `${membersList[0]}.photoURL`)} />
  ) : (
    <Avatar>
      <FontAwesomeIcon icon={faUsers} />
    </Avatar>
  )

}
