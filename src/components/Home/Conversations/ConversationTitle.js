import _get from 'lodash/get'
import { useSelector } from 'react-redux'

export function ConversationTitle({ id }) {
  const currentUserId = useSelector(store => store.auth.user.uid)
  const users = useSelector(store => store.users.users)
  const members = useSelector(store => _get(store, `conversations.members[${id}]`))

  const membersList = Object.keys(members || {})
    .filter((userId) => userId !== currentUserId)

  return membersList.map((userId) => _get(users, `[${userId}].displayName`)).join(', ')
}
