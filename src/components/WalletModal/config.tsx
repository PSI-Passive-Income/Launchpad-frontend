import { ConnectorNames } from 'config/constants/wallets'
import Metamask from './icons/Metamask'
import WalletConnect from './icons/WalletConnect'
import TrustWallet from './icons/TrustWallet'
import MathWallet from './icons/MathWallet'
import TokenPocket from './icons/TokenPocket'
import BinanceChain from './icons/BinanceChain'
import SafePal from './icons/SafePal'
import Coin98 from './icons/Coin98'
import Blocto from './icons/Blocto'
import CoinbaseWallet from './icons/CoinbaseWallet'

import { Config } from './types'

const connectors: Config[] = [
  {
    title: 'Metamask',
    icon: Metamask,
    connectorId: ConnectorNames.Injected,
    priority: 1,
  },
  {
    title: 'WalletConnect',
    icon: WalletConnect,
    connectorId: ConnectorNames.WalletConnect,
    priority: 2,
  },
  {
    title: 'Trust Wallet',
    icon: TrustWallet,
    connectorId: ConnectorNames.Injected,
    priority: 3,
  },
  {
    title: 'MathWallet',
    icon: MathWallet,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: 'TokenPocket',
    icon: TokenPocket,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },

  {
    title: 'Binance Chain',
    icon: BinanceChain,
    connectorId: ConnectorNames.BSC,
    priority: 999,
  },
  {
    title: 'SafePal',
    icon: SafePal,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: 'Coin98',
    icon: Coin98,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: 'Blocto',
    icon: Blocto,
    connectorId: ConnectorNames.Blocto,
    priority: 999,
  },
  {
    title: 'Coinbase',
    icon: CoinbaseWallet,
    connectorId: ConnectorNames.WalletLink,
    priority: 999,
  },
]

export default connectors
export const walletLocalStorageKey = 'wallet'
