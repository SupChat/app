import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { history, store } from './configureStore'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { ThemeProvider } from '@material-ui/styles'
import { purple, cyan } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: purple[700],
    },
    primary: {
      main: cyan[800],
    },
  },
})


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.register()
