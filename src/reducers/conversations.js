const initialState = {
  conversations: {},
  messages: {},
  activeConversation: '' // sessionStorage.getItem('activeConversation') || '',
}

const conversations = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.conversations }

    case 'SET_ACTIVE_CONVERSATION':
      // sessionStorage.setItem('activeConversation', action.activeConversation)
      return { ...state, activeConversation: action.activeConversation }

    case 'SET_MESSAGES':
      const { id, messages } = action.payload

      return {
        ...state,
        messages: {
          ...state.messages,
          [id]: { ...state.messages[id], ...messages }
        },
      }
    default:
      return state
  }
}

export default conversations
