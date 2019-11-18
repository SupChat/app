export const setConversations = (conversations) => ({
  type: 'SET_CONVERSATIONS',
  conversations,
})

export const removeActiveConversation = (id) => ({
  type: 'REMOVE_ACTIVE_CONVERSATION',
  payload: { id },
})

export const setActiveConversations = (activeConversations) => ({
  type: 'SET_ACTIVE_CONVERSATION',
  payload: { activeConversations },
})

export const addActiveConversation = (id) => ({
  type: 'ADD_ACTIVE_CONVERSATION',
  payload: { id },
})

export const setMessages = ({ id, messages }) => ({
  type: 'SET_MESSAGES',
  payload: { id, messages }
})
