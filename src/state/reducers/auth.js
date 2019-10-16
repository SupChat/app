const initialState = {
  user: null,
  initialized: false,
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user, initialized: true }
    default:
      return state
  }
}

export default auth
