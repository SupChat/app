const initialState = {
  conversations: [],
  activeConversation: '',
}

const conversations = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.conversations }

    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversation: action.activeConversation }

    default:
      return state
  }
}

export default conversations
