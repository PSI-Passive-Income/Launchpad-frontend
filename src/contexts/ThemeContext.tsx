import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { light, dark } from 'style/theme'

const CACHE_KEY = 'IS_DARK'

// export const themes = {
//   dark: "",
//   light: "white-content",
// };

// export const ThemeContext = React.createContext({ theme: themes.dark, isDark: true, toggleTheme: () => null })
export const ThemeContext = React.createContext({ isDark: true, toggleTheme: () => null })

export const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    // return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
    return true;
  })

  const toggleTheme = () => {
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      return !prevState
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}