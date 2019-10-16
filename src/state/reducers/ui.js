const initialState = {
  showUsers: true,
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_USERS':
      return { ...state, showUsers: !state.showUsers }
    default:
      return state
  }
}

export default ui
