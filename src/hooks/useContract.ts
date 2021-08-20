import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getPSIContact,
  getCampaignContract,
  getCampaignFactoryContract,
  getTokenFactoryContract,
  getTokenLockFactoryContract,
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useBEP20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

export const usePSI = () => {
  const web3 = useWeb3()
  return useMemo(() => getPSIContact(web3), [web3])
}

export const useCampaign = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getCampaignContract(address, web3), [address, web3])
}

export const useCampaignFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getCampaignFactoryContract(web3), [web3])
}

export const useTokenFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getTokenFactoryContract(web3), [web3])
}

export const useTokenLockFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getTokenLockFactoryContract(web3), [web3])
}
