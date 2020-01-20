import React from 'react'
import Theme from './components/Theme'
import Auth from './components/Auth'
import Routes from './components/Routes'
import BaseStyle from './components/BaseStyle'

const App = () => {
  return (
    <Theme>
      <BaseStyle>
        <Auth>
          <Routes />
        </Auth>
      </BaseStyle>
    </Theme>
  )
}

export default App
