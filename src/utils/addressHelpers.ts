import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56
  const chainId = process.env.REACT_APP_CHAIN_ID
  if (!address) return null;
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getPSIAddress = () => {
  return getAddress(addresses.psi)
}
export const getCampaignFactoryAddress = () => {
  return getAddress(addresses.campaignFactory)
}
export const getTokenFactoryAddress = () => {
  return getAddress(addresses.tokenFactory)
}
export const getTokenLockFactoryAddress = () => {
  return getAddress(addresses.tokenLockFactory)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getPSFactoryAddress = () => {
  return getAddress(addresses.psFactory)
}
export const getPSRouterAddress = () => {
  return getAddress(addresses.psRouter)
}