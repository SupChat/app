import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { cyan, purple } from '@material-ui/core/colors'

const initialState = {
  showUsers: JSON.parse(sessionStorage.getItem('showUsers') || 'true'),
  chatInputHistory: {},
  themes: {
    themeLight: createMuiTheme({
      palette: {
        type: 'light',
        secondary: {
          main: purple[700],
        },
        primary: {
          main: cyan[800],
        },
      },
    }),
    themeDark: createMuiTheme({
      palette: {
        type: 'dark',
        secondary: {
          main: purple[700],
        },
        primary: {
          main: cyan[800],
        },
      },
    }),
  },
  selectedTheme: sessionStorage.getItem('selectedTheme') || 'themeLight',
  showProfile: '',
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_USERS':
      sessionStorage.setItem('showUsers', JSON.stringify(!state.showUsers))
      return { ...state, showUsers: !state.showUsers }

    case 'UPDATE_CHAT_INPUT_HISTORY':
      return { ...state, chatInputHistory: { ...state.chatInputHistory, ...action.payload } }

    case 'TOGGLE_THEME':
      const selectedTheme = state.selectedTheme === 'themeDark' ? 'themeLight' : 'themeDark'
      sessionStorage.setItem('selectedTheme', selectedTheme)
      return { ...state, selectedTheme }

    case 'SHOW_PROFILE':
      return { ...state, showProfile: action.payload }

    default:
      return state
  }
}

export default ui
