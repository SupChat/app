
const initial = {
  messages: []
}

const messages = (state = initial, action) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.messages }
    default:
      return state
  }
}

export default messages
