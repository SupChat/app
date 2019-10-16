import _get from 'lodash/get'
import { useSelector } from 'react-redux'

export function ConversationTitle({ conversation }) {
  const currentUserId = useSelector(store => store.auth.user.uid)
  const users = useSelector(store => store.users.users)

  const membersList = Object.keys(conversation.members || {})
    .filter((userId) => userId !== currentUserId)

  return membersList.map((userId) => _get(users, `[${userId}].displayName`)).join(', ')
}
