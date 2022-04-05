import React, { useState, useMemo } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { light, dark } from 'style/theme'

const CACHE_KEY = 'IS_DARK'

const ThemeContext = React.createContext({ isDark: null, toggleTheme: () => null })

const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    () =>
      // const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
      // return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
      false,
  )

  const toggleTheme = () => {
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      return !prevState
    })
  }

  const props = useMemo(() => ({ isDark, toggleTheme }), [isDark])
  return (
    <ThemeContext.Provider value={props}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
