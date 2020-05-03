import _uniq from 'lodash/uniq'

const initialState = JSON.parse(sessionStorage.getItem('_ui_')) || ({
  showUsers: true,
  chatInputHistory: {},
  selectedTheme: 'themeLight',
  showProfile: '',
  activeConversations: [],
  conversationsSearchInput: ''
})

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_USERS':
      return { ...state, showUsers: !state.showUsers }

    case 'SET_ACTIVE_CONVERSATION': {
      const activeConversations = _uniq(action.payload.activeConversations)
      return { ...state, activeConversations }
    }

    case 'ADD_ACTIVE_CONVERSATION': {
      const { id } = action.payload
      return { ...state, activeConversations: _uniq([ ...state.activeConversations, id ]) }
    }

    case 'REMOVE_ACTIVE_CONVERSATION': {
      const { id } = action.payload
      return { ...state, activeConversations: state.activeConversations.filter(_id => _id !== id) }
    }

    case 'UPDATE_CHAT_INPUT_HISTORY':
      const chatInputHistory = { ...state.chatInputHistory, ...action.payload }
      return { ...state, chatInputHistory }

    case 'TOGGLE_THEME':
      const selectedTheme = state.selectedTheme === 'themeDark' ? 'themeLight' : 'themeDark'
      return { ...state, selectedTheme }

    case 'SHOW_PROFILE':
      return { ...state, showProfile: action.payload }

    case 'SET_CONVERSIONS_SEARCH_INPUT': {
      return { ...state, conversationsSearchInput: action.payload }
    }

    default:
      return state
  }
}

export default ui
