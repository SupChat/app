import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { useSelector } from 'react-redux'
import THEMES from '../consts/themes'

export default function Theme({ children }) {
  const theme = useSelector(store => THEMES[store.ui.selectedTheme])

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}