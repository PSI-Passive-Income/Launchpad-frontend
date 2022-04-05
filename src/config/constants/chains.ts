import { chains, ChainId, Chain } from 'eth-chains'

export enum SupportedChainId {
  MAINNET = ChainId.EthereumMainnet,
  ROPSTEN = ChainId.EthereumTestnetRopsten,
  RINKEBY = ChainId.EthereumTestnetRinkeby,
  GOERLI = ChainId.EthereumTestnetGörli,
  KOVAN = ChainId.EthereumTestnetKovan,

  BSCMAINNET = ChainId.BinanceSmartChainMainnet,
  BSCTESTNET = ChainId.BinanceSmartChainTestnet,

  ARBITRUM_ONE = ChainId.ArbitrumOne,
  ARBITRUM_RINKEBY = ChainId.ArbitrumTestnetRinkeby,
  OPTIMISM = ChainId.OptimisticEthereum,
  OPTIMISTIC_KOVAN = ChainId.OptimisticEthereumTestnetKovan,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId) as SupportedChainId[]

type ChainInfoList = { readonly [chainId in SupportedChainId]: Chain }

export const CHAIN_INFO: ChainInfoList = ALL_SUPPORTED_CHAIN_IDS.reduce(
  (val, id) => ({
    ...val,
    [id]: chains.getById(id),
  }),
  {},
)
