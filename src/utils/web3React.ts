import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { IWalletConnectProviderOptions } from '@walletconnect/types'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from 'config/constants/wallets'
import { NetworkConnector } from 'connectors/NetworkConnector'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

export const injected = new InjectedConnector({})
// export const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletConnectorSetting: IWalletConnectProviderOptions = {
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
}
export const walletconnect = new WalletConnectConnector(walletConnectorSetting)

export const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider: any): Web3Provider => {
  // const library = new Web3Provider(
  //   provider,
  //   // eslint-disable-next-line no-nested-ternary
  //   typeof provider.chainId === 'number'
  //     ? provider.chainId
  //     : typeof provider.chainId === 'string'
  //     ? parseInt(provider.chainId)
  //     : 'any'
  // )
  const library = new Web3Provider(provider)
  library.pollingInterval = 1_000
  return library
}

export const network = new NetworkConnector({
  urls: { [chainId]: rpcUrl },
})
