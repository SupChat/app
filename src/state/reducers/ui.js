const initialState = {
  showUsers: true,
  chatInputHistory: {}
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_USERS':
      return { ...state, showUsers: !state.showUsers }
    case 'UPDATE_CHAT_INPUT_HISTORY':
      return { ...state, chatInputHistory: { ...state.chatInputHistory, ...action.payload }}
    default:
      return state
  }
}

export default ui
