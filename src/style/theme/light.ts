import { DefaultTheme } from 'styled-components'
import { dark as lightAlert } from '../../components/Alert/theme'
import { dark as lightCard } from '../../components/Card/theme'
import { dark as lightModal } from '../../components/Modal/theme'
import base from './base'
import { lightColors } from './colors'

const lightTheme: DefaultTheme = {
  ...base,
  isDark: false,
  colors: lightColors,
  alert: lightAlert,
  card: lightCard,
  modal: lightModal,
}

export default lightTheme
