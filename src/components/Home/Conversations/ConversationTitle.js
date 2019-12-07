import React from 'react'
import _get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'

export function ConversationTitle({ id }) {
  const currentUserId = useSelector(store => store.auth.user.uid)
  const users = useSelector(store => store.users.users)
  const members = useSelector(store => _get(store, `conversations.members[${id}]`))
  const dispatch = useDispatch()

  const membersList = Object.keys(members || {})
    .filter((userId) => userId !== currentUserId)

  function showProfile() {
    dispatch({ type: 'SHOW_PROFILE', payload: id })
  }

  return (
    <span onClick={showProfile}>
      {membersList.map((userId) => _get(users, `[${userId}].displayName`)).join(', ')}
    </span>
  )
}
