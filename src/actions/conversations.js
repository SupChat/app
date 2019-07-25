import _get from 'lodash/get'

export const setConversations = (conversations) => ({
  type: 'SET_CONVERSATIONS',
  conversations,
})

export const setActiveConversation = (activeConversation) => ({
  type: 'SET_ACTIVE_CONVERSATION',
  activeConversation,
})

export const setMessages = ({ id, messages }) => ({
  type: 'SET_MESSAGES',
  payload: { id, messages }
})

export const selectActiveConversation = ({ conversations: { conversations, activeConversation }}) => _get(conversations, activeConversation)
