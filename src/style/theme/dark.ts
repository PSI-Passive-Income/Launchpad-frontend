import { DefaultTheme } from 'styled-components'
import { dark as darkAlert } from '../../components/Alert/theme'
import { dark as darkCard } from '../../components/Card/theme'
import { dark as darkModal } from '../../components/Modal/theme'
import base from './base'
import { darkColors } from './colors'

const darkTheme: DefaultTheme = {
  ...base,
  isDark: true,
  colors: darkColors,
  alert: darkAlert,
  card: darkCard,
  modal: darkModal,
}

export default darkTheme
