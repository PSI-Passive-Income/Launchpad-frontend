import { ConnectorNames } from 'config/constants/wallets'
import { FC } from 'react'
import { SvgProps } from '../Svg/types'

export type Login = (connectorId: ConnectorNames) => void

export interface Config {
  title: string
  icon: FC<SvgProps>
  connectorId: ConnectorNames
  priority: number
}
