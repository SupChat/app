import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { cyan, purple } from '@material-ui/core/colors'

const THEMES = {
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
}

export default THEMES;