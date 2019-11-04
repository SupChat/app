const initialState = {
  showUsers: JSON.parse(sessionStorage.getItem('showUsers') || 'true'),
  chatInputHistory: {}
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_USERS':
      sessionStorage.setItem('showUsers', JSON.stringify(!state.showUsers))
      return { ...state, showUsers: !state.showUsers }
    case 'UPDATE_CHAT_INPUT_HISTORY':
      return { ...state, chatInputHistory: { ...state.chatInputHistory, ...action.payload }}
    default:
      return state
  }
}

export default ui
