import React from 'react'
import _get from 'lodash/get'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'

export default function ConversationAvatar({ id }) {
  const users = useSelector(store => store.users.users)
  const currentUserId = useSelector(store => store.auth.user.uid)
  const members = useSelector(store => _get(store, `conversations.members[${id}]`))

  const membersList = Object.keys(members || {})

  switch (membersList.length) {
    case 0: {
      return <Avatar />
    }
    case 1: {
      return <Avatar src={_get(users, `${currentUserId}.photoURL`)} />
    }
    case 2: {
      const memberId = membersList.find(userId => userId !== currentUserId)
      return <Avatar src={_get(users, `${memberId}.photoURL`)} />
    }
    default: {
      return <Avatar>
        <FontAwesomeIcon icon={faUsers} />
      </Avatar>

    }
  }

}
