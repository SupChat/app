import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { useSelector } from 'react-redux'

export default function Theme({ children }) {
  const theme = useSelector(store => store.ui.themes[store.ui.selectedTheme])

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}